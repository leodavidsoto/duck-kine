/**
 * WhatsApp Webhook Controller
 * ═══════════════════════════════════════════════════════
 * Handles Meta webhook verification and incoming messages.
 */

const WhatsAppService = require('../services/whatsapp.service');

/**
 * GET /api/whatsapp/webhook
 * Meta webhook verification (challenge-response)
 */
async function verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const env = require('../config/env');

    if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
        console.log('WhatsApp webhook verified');
        return res.status(200).send(challenge);
    }

    return res.status(403).json({ error: 'Verification failed' });
}

/**
 * POST /api/whatsapp/webhook
 * Receives incoming WhatsApp messages from Meta
 */
async function handleWebhook(req, res) {
    // Always respond 200 quickly to Meta (they retry on timeouts)
    res.status(200).json({ status: 'ok' });

    try {
        const body = req.body;

        // Validate it's a WhatsApp message event
        if (body.object !== 'whatsapp_business_account') return;

        for (const entry of body.entry || []) {
            for (const change of entry.changes || []) {
                if (change.field !== 'messages') continue;

                const messages = change.value?.messages || [];
                const contacts = change.value?.contacts || [];

                for (const message of messages) {
                    // Only handle text messages for now
                    if (message.type !== 'text') continue;

                    const waId = message.from; // Sender's phone number
                    const messageBody = message.text?.body;
                    const waMessageId = message.id;
                    const senderName = contacts.find(c => c.wa_id === waId)?.profile?.name || null;

                    if (!messageBody) continue;

                    console.log(`WhatsApp message from ${waId}: ${messageBody.substring(0, 50)}...`);

                    await WhatsAppService.processIncoming(waId, messageBody, senderName, waMessageId);
                }

                // Handle status updates (delivered, read, etc.)
                const statuses = change.value?.statuses || [];
                for (const status of statuses) {
                    await handleStatusUpdate(status);
                }
            }
        }
    } catch (error) {
        console.error('WhatsApp webhook error:', error);
    }
}

/**
 * Update message delivery status
 */
async function handleStatusUpdate(status) {
    try {
        const prisma = require('../config/database');
        if (status.id) {
            await prisma.whatsAppMessage.updateMany({
                where: { waMessageId: status.id },
                data: { status: status.status },
            });
        }
    } catch {
        // Status updates are best-effort
    }
}

/**
 * GET /api/whatsapp/conversations
 * List all WhatsApp conversations (admin)
 */
async function listConversations(req, res) {
    const { page, limit, status } = req.query;
    const result = await WhatsAppService.getConversations({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status: status || null,
    });
    res.json(result);
}

/**
 * GET /api/whatsapp/conversations/:id/messages
 * Get messages for a conversation (admin)
 */
async function getConversationMessages(req, res) {
    const { page, limit } = req.query;
    const result = await WhatsAppService.getMessages(req.params.id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50,
    });
    res.json(result);
}

/**
 * POST /api/whatsapp/send
 * Send a manual message (admin/professional)
 */
async function sendManualMessage(req, res) {
    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({ error: 'Se requiere "to" y "message"' });
    }

    const prisma = require('../config/database');

    const waMessageId = await WhatsAppService.sendMessage(to, message);

    // Find or create conversation
    let conversation = await prisma.whatsAppConversation.findUnique({ where: { waId: to } });
    if (conversation) {
        await prisma.whatsAppMessage.create({
            data: {
                conversationId: conversation.id,
                waMessageId,
                direction: 'OUTBOUND',
                body: message,
                aiGenerated: false,
            },
        });
    }

    res.json({ success: true, messageId: waMessageId });
}

module.exports = {
    verifyWebhook,
    handleWebhook,
    listConversations,
    getConversationMessages,
    sendManualMessage,
};
