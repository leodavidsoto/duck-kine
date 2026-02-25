const { z } = require('zod');

const initPaymentSchema = {
    body: z.object({
        appointmentId: z.string().uuid(),
        amount: z.number().positive('Monto debe ser positivo'),
        method: z.enum(['WEBPAY', 'TRANSFER', 'CASH']).default('WEBPAY'),
    }),
};

module.exports = { initPaymentSchema };
