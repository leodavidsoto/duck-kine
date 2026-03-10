/**
 * WhatsApp Service for Duck Kinesiologia
 * ═══════════════════════════════════════════════════════
 * Handles sending/receiving messages via Meta Cloud API.
 * Manages conversation state and links to patients.
 */

const crypto = require('crypto');
const env = require('../config/env');
const prisma = require('../config/database');
const ClaudeService = require('./claude.service');
const AIClinicalExtractor = require('../utils/aiClinicalExtractor');

const META_API_URL = 'https://graph.facebook.com/v21.0';

class WhatsAppService {
    /**
     * Send a text message via WhatsApp
     */
    static async sendMessage(to, text) {
        const url = `${META_API_URL}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to,
                type: 'text',
                text: { body: text },
            }),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            console.error('WhatsApp send error:', error);
            throw new Error(`WhatsApp API error: ${res.status}`);
        }

        const data = await res.json();
        return data.messages?.[0]?.id || null;
    }

    /**
     * Process an incoming WhatsApp message
     */
    static async processIncoming(waId, messageBody, senderName, waMessageId) {
        // 1. Find or create conversation
        let conversation = await prisma.whatsAppConversation.findUnique({
            where: { waId },
        });

        if (!conversation) {
            // Try to match with existing patient by phone number
            const normalizedPhone = '+' + waId;
            const user = await prisma.user.findFirst({
                where: { phone: normalizedPhone },
                include: { patient: true },
            });

            conversation = await prisma.whatsAppConversation.create({
                data: {
                    waId,
                    patientId: user?.patient?.id || null,
                    contactName: senderName,
                    status: 'ACTIVE',
                },
            });
        }

        // 2. Save inbound message
        await prisma.whatsAppMessage.create({
            data: {
                conversationId: conversation.id,
                waMessageId,
                direction: 'INBOUND',
                body: messageBody,
            },
        });

        // Update conversation timestamp
        await prisma.whatsAppConversation.update({
            where: { id: conversation.id },
            data: {
                lastMessageAt: new Date(),
                contactName: senderName || conversation.contactName,
            },
        });

        // 3. Get conversation history for AI context
        const history = await prisma.whatsAppMessage.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: 'asc' },
            take: 20,
        });

        // 4. Get patient context if linked
        const patientContext = await ClaudeService.getPatientContext(conversation.patientId);

        // 5. Generate AI response
        const aiResponse = await ClaudeService.generateResponse(messageBody, history, patientContext);

        // 6. Send AI response
        let sentMessageId;
        if (aiResponse) {
            sentMessageId = await this.sendMessage(conversation.waId, aiResponse);
        }
        // 7. Save outbound message
        await prisma.whatsAppMessage.create({
            data: {
                conversationId: conversation.id,
                waMessageId: sentMessageId || ('local_' + Date.now()),
                direction: 'OUTBOUND',
                body: aiResponse,
                aiGenerated: true,
            },
        });

        // 8. Extract potential clinical data (Async, non-blocking to the user response)
        this.extractAndSaveClinicalData(messageBody, conversation.patientId).catch(err => {
            console.error('Error background clinical extraction:', err);
        });

        return { conversationId: conversation.id, response: aiResponse };
    }

    /**
     * Extracts clinical data using AI and saves it to the patient profile
     */
    static async extractAndSaveClinicalData(messageBody, patientId) {
        if (!patientId) return;

        const clinicalData = await AIClinicalExtractor.extract(messageBody);

        if (!clinicalData.hasClinicalData) return;

        const professionalId = await AIClinicalExtractor.getVirtualAssistantId();

        if (clinicalData.type === 'PAIN_RECORD' || clinicalData.evaScore !== null) {
            await prisma.painRecord.create({
                data: {
                    patientId,
                    location: clinicalData.location || 'No especificada',
                    painLevel: this.evaToPainLevel(clinicalData.evaScore || 0),
                    evaScore: clinicalData.evaScore || 0,
                    context: clinicalData.context || 'Reporte asíncrono vía WhatsApp',
                    notes: clinicalData.observations
                }
            });
        } else if (clinicalData.type === 'CLINICAL_UPDATE') {
            await prisma.clinicalRecord.create({
                data: {
                    patientId,
                    professionalId,
                    reasonForVisit: 'Reporte asíncrono vía WhatsApp',
                    currentIllness: clinicalData.observations,
                    observations: `Contexto: ${clinicalData.context || 'N/A'}`
                }
            });
        }
    }

    static evaToPainLevel(eva) {
        if (eva === 0) return 'NONE';
        if (eva <= 3) return 'MILD';
        if (eva <= 6) return 'MODERATE';
        if (eva <= 8) return 'SEVERE';
        return 'EXTREME';
    }

    /**
     * Verify webhook signature from Meta
     */
    static verifySignature(rawBody, signature) {
        if (!env.WHATSAPP_APP_SECRET || !signature) return false;
        const expectedSig = crypto
            .createHmac('sha256', env.WHATSAPP_APP_SECRET)
            .update(rawBody)
            .digest('hex');
        const providedSig = signature.replace('sha256=', '');
        return crypto.timingSafeEqual(
            Buffer.from(expectedSig, 'hex'),
            Buffer.from(providedSig, 'hex'),
        );
    }

    /**
     * Send a template message (for notifications like appointment reminders)
     */
    static async sendTemplateMessage(to, templateName, languageCode, components) {
        const url = `${META_API_URL}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: languageCode || 'es' },
                    components: components || [],
                },
            }),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            console.error('WhatsApp template error:', error);
            throw new Error(`WhatsApp template error: ${res.status}`);
        }

        return res.json();
    }

    /**
     * Get conversation history for admin view
     */
    static async getConversations({ page = 1, limit = 20, status = null }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status) where.status = status;

        const [conversations, total] = await Promise.all([
            prisma.whatsAppConversation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { lastMessageAt: 'desc' },
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                    messages: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
            }),
            prisma.whatsAppConversation.count({ where }),
        ]);

        return { conversations, total, page, totalPages: Math.ceil(total / limit) };
    }

    /**
     * Get messages for a specific conversation
     */
    static async getMessages(conversationId, { page = 1, limit = 50 }) {
        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            prisma.whatsAppMessage.findMany({
                where: { conversationId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.whatsAppMessage.count({ where: { conversationId } }),
        ]);

        return { messages: messages.reverse(), total, page, totalPages: Math.ceil(total / limit) };
    }
}

module.exports = WhatsAppService;
