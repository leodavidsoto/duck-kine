const { ZodError } = require('zod');

/**
 * Request Validation Middleware using Zod schemas
 * Validates body, query, and params separately
 * Compatible with Zod v4
 */
const validate = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }
            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }
            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Zod v4 uses .issues, v3 uses .errors
                const issues = error.issues || error.errors || [];
                const formattedErrors = issues.map((err) => ({
                    field: (err.path || []).join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: 'Error de validación',
                    details: formattedErrors,
                });
            }
            next(error);
        }
    };
};

module.exports = { validate };
