const env = require('../config/env');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, _next) => {
    console.error('❌ Error:', err.message);
    if (env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Prisma known errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'El registro ya existe (campo único duplicado)',
            field: err.meta?.target,
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Registro no encontrado' });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        error: err.message || 'Error interno del servidor',
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = { errorHandler };
