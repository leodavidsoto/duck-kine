/**
 * Claude AI Service for Duck Kinesiologia
 * ═══════════════════════════════════════════════════════
 * Processes patient WhatsApp messages with clinic context.
 * Uses Claude to provide intelligent responses about services,
 * appointments, pricing, and general kinesiology questions.
 */

const Anthropic = require('@anthropic-ai/sdk');
const env = require('../config/env');
const prisma = require('../config/database');

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el asistente virtual de Duck Kinesiologia, una clinica de kinesiologia en Santiago, Chile.

INFORMACIÓN DE LA CLÍNICA:
- Nombre: Duck Kinesiologia
- WhatsApp: +56 9 8662 5344
- Ubicación: Santiago, Chile
- Horario: Lunes a Viernes 08:00 - 20:00
- Web: https://duckkine.cl

SERVICIOS PRINCIPALES:
- Kinesiologia traumatologica y deportiva
- Rehabilitacion post-quirurgica
- Kinesiologia neurologica
- Evaluaciones fisicas completas
- Programas deportivos (rehabilitacion, rendimiento, prevencion)
- Clases de entrenamiento funcional grupal
- Academia digital (cursos online)
- Planes corporativos para empresas

TU ROL:
1. Responder consultas sobre servicios, horarios y precios de forma amable y profesional
2. Ayudar a los pacientes a agendar citas (indicarles que pueden hacerlo en duckkine.cl/reservar o que un profesional los contactara)
3. Dar informacion general sobre kinesiologia y rehabilitacion
4. Para consultas medicas especificas, siempre recomendar una evaluacion presencial con un profesional
5. Si el paciente tiene dolor agudo o una emergencia, indicar que acuda a urgencias

REGLAS:
- Responde SIEMPRE en español chileno, de forma cercana pero profesional
- Usa "tú" (no "usted")
- Mantén las respuestas cortas y claras (maximo 3-4 parrafos)
- NO diagnostiques ni des tratamientos especificos
- Si no sabes algo, di que un profesional se pondra en contacto
- Incluye emojis con moderacion para ser amigable
- Si preguntan por precios exactos que no conoces, indica que depende de la evaluacion y ofrece agendar una hora`;

class ClaudeService {
    /**
     * Generate a response to a patient message using conversation history
     */
    static async generateResponse(userMessage, conversationHistory = [], patientContext = null) {
        const messages = [];

        // Add conversation history (last 10 messages for context)
        // History already includes the just-saved inbound message, so we use it directly
        const recentHistory = conversationHistory.slice(-10);
        for (const msg of recentHistory) {
            messages.push({
                role: msg.direction === 'INBOUND' ? 'user' : 'assistant',
                content: msg.body,
            });
        }

        // Only add current message if it's not already the last in history
        const lastHistoryMsg = recentHistory[recentHistory.length - 1];
        const alreadyInHistory = lastHistoryMsg
            && lastHistoryMsg.direction === 'INBOUND'
            && lastHistoryMsg.body === userMessage;
        if (!alreadyInHistory) {
            messages.push({ role: 'user', content: userMessage });
        }

        // Ensure we don't send empty messages array
        if (messages.length === 0) {
            messages.push({ role: 'user', content: userMessage });
        }

        // Build system prompt with patient context if available
        let systemPrompt = SYSTEM_PROMPT;
        if (patientContext) {
            systemPrompt += `\n\nCONTEXTO DEL PACIENTE (informacion interna, no la compartas directamente):
- Nombre: ${patientContext.name}
- Proxima cita: ${patientContext.nextAppointment || 'Sin citas agendadas'}
- Ultimo servicio: ${patientContext.lastService || 'Paciente nuevo'}
- Dolor reciente: ${patientContext.recentPain || 'Sin registros'}`;
        }

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            system: systemPrompt,
            messages,
        });

        return response.content[0].text;
    }

    /**
     * Get patient context from database for personalized responses
     */
    static async getPatientContext(patientId) {
        if (!patientId) return null;

        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                user: { select: { firstName: true, lastName: true } },
                appointments: {
                    where: { status: { in: ['PENDING', 'CONFIRMED'] }, startTime: { gte: new Date() } },
                    orderBy: { startTime: 'asc' },
                    take: 1,
                    include: { service: true, professional: { include: { user: true } } },
                },
                painRecords: { orderBy: { recordedAt: 'desc' }, take: 1 },
                sessions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: { appointment: { include: { service: true } } },
                },
            },
        });

        if (!patient) return null;

        const nextApt = patient.appointments[0];
        const lastSession = patient.sessions[0];
        const lastPain = patient.painRecords[0];

        return {
            name: `${patient.user.firstName} ${patient.user.lastName}`,
            nextAppointment: nextApt
                ? `${nextApt.service.name} el ${formatDateCL(nextApt.startTime)} con ${nextApt.professional.user.firstName}`
                : null,
            lastService: lastSession?.appointment?.service?.name || null,
            recentPain: lastPain
                ? `${lastPain.location} - EVA ${lastPain.evaScore}/10 (${formatDateCL(lastPain.recordedAt)})`
                : null,
        };
    }
}

function formatDateCL(date) {
    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Santiago',
    }).format(new Date(date));
}

module.exports = ClaudeService;
