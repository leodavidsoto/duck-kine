/**
 * Role-Based Access Control Middleware
 * Supports: PATIENT, PROFESSIONAL, ADMIN, CLINIC_DIRECTOR,
 *           FRANCHISE_ADMIN, ORG_ADMIN, SUPER_ADMIN
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // SUPER_ADMIN and ORG_ADMIN always have access
        if (['SUPER_ADMIN', 'ORG_ADMIN'].includes(req.user.role)) {
            return next();
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'No tienes permisos para realizar esta acción',
            });
        }

        next();
    };
};

module.exports = { authorize };
