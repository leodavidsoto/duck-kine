const { z } = require('zod');

// Validador RUT chileno
const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;

const registerSchema = {
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(8, 'Mínimo 8 caracteres'),
        firstName: z.string().min(2, 'Nombre muy corto'),
        lastName: z.string().min(2, 'Apellido muy corto'),
        rut: z.string().regex(rutRegex, 'RUT inválido (formato: 12.345.678-9)'),
        phone: z.string().optional(),
    }),
};

const loginSchema = {
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'Contraseña requerida'),
    }),
};

module.exports = { registerSchema, loginSchema };
