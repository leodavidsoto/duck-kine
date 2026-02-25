const { z } = require('zod');

const updatePatientSchema = {
    body: z.object({
        birthDate: z.string().datetime().optional(),
        prevision: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        medicalHistory: z.string().optional(),
        allergies: z.string().optional(),
    }),
};

module.exports = { updatePatientSchema };
