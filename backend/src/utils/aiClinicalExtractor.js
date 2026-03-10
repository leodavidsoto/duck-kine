const Anthropic = require('@anthropic-ai/sdk');
const env = require('../config/env');
const prisma = require('../config/database');

const EXTRACTOR_PROMPT = `
Eres un analizador de información médica de Duck Kinesiología.
Tu única labor es leer un mensaje de un paciente e identificar si contiene información clínica relevante que deba registrarse en su ficha (ClinicalRecord) o reporte de dolor (PainRecord).

Reglas de extracción:
1. Si el paciente menciona: dolor (nivel o ubicación), síntomas, avance de su terapia, o cómo se sintió después de una sesión, DEBES extraerlo.
2. Si es solo saludos, consultas de precios, horarios o dudas generales, NO extraigas nada.

Devuelve SIEMPRE y ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
{
  "hasClinicalData": true/false,
  "type": "PAIN_RECORD" | "CLINICAL_UPDATE" | null,
  "evaScore": 0-10 | null (si menciona nivel de dolor del 1 al 10, o palabras como "me duele mucho" (7-8), "un poco" (3)),
  "location": "texto libre de donde le duele" | null,
  "context": "texto libre de la situación" | null,
  "observations": "Resumen conciso y clínico de lo que el paciente reporta en tercera persona" | null
}
Asegúrate de no incluir texto markdown, solo el JSON raw.
`;

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

class AIClinicalExtractor {
    static async extract(messageBody) {
        try {
            const response = await client.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 300,
                system: EXTRACTOR_PROMPT,
                messages: [{ role: 'user', content: messageBody }]
            });

            const textResponse = response.content[0].text.trim();
            // Handle edge case where Claude wraps in markdown
            const jsonText = textResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
            const data = JSON.parse(jsonText);

            return data;
        } catch (error) {
            console.error('AI Clinical Extraction error:', error);
            return { hasClinicalData: false };
        }
    }

    static _virtualProfessionalId = null;

    static async getVirtualAssistantId() {
        // Cache to avoid repeated DB lookups and race conditions
        if (this._virtualProfessionalId) return this._virtualProfessionalId;

        // Find or create the Virtual Assistant Professional profile
        let virtualAssistantUser = await prisma.user.findFirst({
            where: { email: 'claude.assistant@duckkine.cl' }
        });

        if (!virtualAssistantUser) {
            const bcrypt = require('bcryptjs');
            const passwordHash = await bcrypt.hash('duckbot_internal_' + Date.now(), 10);

            try {
                virtualAssistantUser = await prisma.user.create({
                    data: {
                        email: 'claude.assistant@duckkine.cl',
                        passwordHash,
                        firstName: 'DuckBot',
                        lastName: 'AI Asistente',
                        rut: '0.000.000-AI',
                        role: 'PROFESSIONAL',
                        isActive: false, // Cannot log in
                    }
                });

                await prisma.professional.create({
                    data: {
                        userId: virtualAssistantUser.id,
                        specialty: 'Inteligencia Artificial Clínica',
                        bio: 'Asistente virtual de Duck Kinesiología (Claude AI).',
                        isAvailable: false,
                    }
                });
            } catch (err) {
                // Race condition: another request created it first
                virtualAssistantUser = await prisma.user.findFirst({
                    where: { email: 'claude.assistant@duckkine.cl' }
                });
                if (!virtualAssistantUser) throw err;
            }
        }

        const professional = await prisma.professional.findUnique({
            where: { userId: virtualAssistantUser.id }
        });

        this._virtualProfessionalId = professional.id;
        return professional.id;
    }
}

module.exports = AIClinicalExtractor;
