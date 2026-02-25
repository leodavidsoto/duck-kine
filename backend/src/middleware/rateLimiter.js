const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Demasiadas solicitudes, intenta más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos de autenticación' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
