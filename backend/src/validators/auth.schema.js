const { z } = require('zod');

// Validador RUT chileno — acepta con o sin puntos: 12.345.678-9 o 12345678-9
const rutRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/;

/**
 * Formatea RUT al formato estándar: 12.345.678-9
 */
function formatRut(rut) {
    // Remove dots and spaces, keep dash
    const clean = rut.replace(/\./g, '').replace(/\s/g, '');
    const [body, dv] = clean.split('-');
    if (!body || !dv) return rut;
    // Add dots
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
}

const registerSchema = {
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(8, 'Mínimo 8 caracteres'),
        firstName: z.string().min(2, 'Nombre muy corto'),
        lastName: z.string().min(2, 'Apellido muy corto'),
        rut: z.string()
            .regex(rutRegex, 'RUT inválido (formato: 12.345.678-9)')
            .transform(formatRut),
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
