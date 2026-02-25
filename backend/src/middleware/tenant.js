/**
 * Multi-Tenant Middleware
 * ═══════════════════════════════════════════════════════
 * Extracts clinicId from request and validates access.
 * Injects req.clinicId for downstream services to filter data.
 * 
 * Priority: X-Clinic-Id header > query.clinicId > user defaultClinicId
 */

const prisma = require('../config/database');

// ─── Extract Clinic Context ─────────────────────────────
const extractClinic = async (req, res, next) => {
    const clinicId =
        req.headers['x-clinic-id'] ||
        req.query.clinicId ||
        req.user?.defaultClinicId ||
        null;

    req.clinicId = clinicId;
    next();
};

// ─── Require Clinic Context ─────────────────────────────
// Use on routes that MUST have a clinic (appointments, sessions, etc.)
const requireClinic = (req, res, next) => {
    if (!req.clinicId) {
        return res.status(400).json({
            error: 'Se requiere especificar una clínica (X-Clinic-Id header)',
        });
    }
    next();
};

// ─── Validate Clinic Access ─────────────────────────────
// Ensures user has permission to access the specified clinic
const validateClinicAccess = async (req, res, next) => {
    if (!req.clinicId || !req.user) return next();

    const { role } = req.user;

    // Super admins and org admins can access all clinics
    if (['SUPER_ADMIN', 'ORG_ADMIN', 'ADMIN'].includes(role)) {
        return next();
    }

    // Franchise admins can only access their franchise clinic
    if (role === 'FRANCHISE_ADMIN') {
        const license = await prisma.franchiseLicense.findFirst({
            where: {
                clinicId: req.clinicId,
                franchiseeRut: req.user.rut,
                status: 'LICENSE_ACTIVE',
            },
        });
        if (!license) {
            return res.status(403).json({ error: 'Sin acceso a esta clínica' });
        }
        return next();
    }

    // Professionals must be assigned to the clinic
    if (['PROFESSIONAL', 'CLINIC_DIRECTOR'].includes(role)) {
        const assignment = await prisma.clinicProfessional.findFirst({
            where: {
                clinicId: req.clinicId,
                professional: { userId: req.user.id },
                isActive: true,
            },
        });
        if (!assignment) {
            return res.status(403).json({ error: 'No estás asignado a esta clínica' });
        }
        req.clinicRole = assignment.role; // DIRECTOR, COORDINATOR, STAFF
        return next();
    }

    // Patients can access any clinic (they book at different locations)
    if (role === 'PATIENT') {
        return next();
    }

    return res.status(403).json({ error: 'Rol no reconocido para acceso a clínica' });
};

// ─── Prisma Query Filter Helper ─────────────────────────
// Use in services: const filter = clinicFilter(req.clinicId);
// Then: prisma.appointment.findMany({ where: { ...filter, ...otherConditions } })
const clinicFilter = (clinicId) => {
    return clinicId ? { clinicId } : {};
};

module.exports = {
    extractClinic,
    requireClinic,
    validateClinicAccess,
    clinicFilter,
};
