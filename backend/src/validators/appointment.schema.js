const { z } = require('zod');

const createAppointmentSchema = {
    body: z.object({
        professionalId: z.string().uuid(),
        serviceId: z.string().uuid(),
        startTime: z.string().datetime(),
        notes: z.string().optional(),
    }),
};

const updateAppointmentSchema = {
    body: z.object({
        status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
        notes: z.string().optional(),
        startTime: z.string().datetime().optional(),
    }),
};

module.exports = { createAppointmentSchema, updateAppointmentSchema };
