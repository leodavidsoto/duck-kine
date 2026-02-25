/**
 * Franchise & Clinic Management Routes
 * ═══════════════════════════════════════════════════════
 * Routes for managing organizations, clinics, franchise licenses,
 * and network-level reporting.
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { extractClinic, validateClinicAccess } = require('../middleware/tenant');
const FranchiseService = require('../services/franchise.service');

// ─── ORGANIZATION ────────────────────────────────────────

// GET /api/franchise/organization/:id — Get organization details
router.get('/organization/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const org = await FranchiseService.getOrganization(req.params.id);
            if (!org) return res.status(404).json({ error: 'Organización no encontrada' });
            res.json(org);
        } catch (err) { next(err); }
    }
);

// POST /api/franchise/organization — Create organization
router.post('/organization',
    authenticate,
    authorize('SUPER_ADMIN'),
    async (req, res, next) => {
        try {
            const org = await FranchiseService.createOrganization(req.body);
            res.status(201).json(org);
        } catch (err) { next(err); }
    }
);

// ─── CLINICS ─────────────────────────────────────────────

// GET /api/franchise/clinics — List clinics for an organization
router.get('/clinics',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN', 'ADMIN'),
    async (req, res, next) => {
        try {
            const { organizationId, status, type, city } = req.query;
            const clinics = await FranchiseService.getClinics(organizationId, { status, type, city });
            res.json(clinics);
        } catch (err) { next(err); }
    }
);

// GET /api/franchise/clinics/:slug — Get clinic by slug (public)
router.get('/clinics/:slug', async (req, res, next) => {
    try {
        const clinic = await FranchiseService.getClinicBySlug(req.params.slug);
        if (!clinic) return res.status(404).json({ error: 'Clínica no encontrada' });
        res.json(clinic);
    } catch (err) { next(err); }
});

// POST /api/franchise/clinics — Create a new clinic
router.post('/clinics',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const clinic = await FranchiseService.createClinic(req.body);
            res.status(201).json(clinic);
        } catch (err) { next(err); }
    }
);

// PATCH /api/franchise/clinics/:id — Update clinic
router.patch('/clinics/:id',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN', 'CLINIC_DIRECTOR'),
    extractClinic,
    validateClinicAccess,
    async (req, res, next) => {
        try {
            const clinic = await FranchiseService.updateClinic(req.params.id, req.body);
            res.json(clinic);
        } catch (err) { next(err); }
    }
);

// ─── PROFESSIONALS ASSIGNMENT ────────────────────────────

// POST /api/franchise/clinics/:clinicId/professionals — Assign
router.post('/clinics/:clinicId/professionals',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN', 'CLINIC_DIRECTOR'),
    async (req, res, next) => {
        try {
            const { professionalId, role } = req.body;
            const result = await FranchiseService.assignProfessional(
                req.params.clinicId, professionalId, role
            );
            res.status(201).json(result);
        } catch (err) { next(err); }
    }
);

// DELETE /api/franchise/clinics/:clinicId/professionals/:professionalId
router.delete('/clinics/:clinicId/professionals/:professionalId',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN', 'CLINIC_DIRECTOR'),
    async (req, res, next) => {
        try {
            const result = await FranchiseService.removeProfessional(
                req.params.clinicId, req.params.professionalId
            );
            res.json(result);
        } catch (err) { next(err); }
    }
);

// ─── ROOMS ───────────────────────────────────────────────

// GET /api/franchise/clinics/:clinicId/rooms
router.get('/clinics/:clinicId/rooms',
    authenticate,
    async (req, res, next) => {
        try {
            const rooms = await FranchiseService.getRooms(req.params.clinicId);
            res.json(rooms);
        } catch (err) { next(err); }
    }
);

// POST /api/franchise/clinics/:clinicId/rooms
router.post('/clinics/:clinicId/rooms',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN', 'CLINIC_DIRECTOR'),
    async (req, res, next) => {
        try {
            const room = await FranchiseService.createRoom(req.params.clinicId, req.body);
            res.status(201).json(room);
        } catch (err) { next(err); }
    }
);

// ─── FRANCHISE LICENSES ──────────────────────────────────

// GET /api/franchise/licenses — List franchise licenses
router.get('/licenses',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const licenses = await FranchiseService.getLicenses(req.query.organizationId);
            res.json(licenses);
        } catch (err) { next(err); }
    }
);

// POST /api/franchise/licenses — Create franchise license + clinic
router.post('/licenses',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const license = await FranchiseService.createLicense(req.body);
            res.status(201).json(license);
        } catch (err) { next(err); }
    }
);

// PATCH /api/franchise/licenses/:id/status — Update license status
router.patch('/licenses/:id/status',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const license = await FranchiseService.updateLicenseStatus(
                req.params.id, req.body.status
            );
            res.json(license);
        } catch (err) { next(err); }
    }
);

// ─── FRANCHISE PAYMENTS ──────────────────────────────────

// POST /api/franchise/licenses/:id/calculate — Calculate monthly payment
router.post('/licenses/:id/calculate',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const payment = await FranchiseService.calculateMonthlyPayment(
                req.params.id, req.body.period
            );
            res.json(payment);
        } catch (err) { next(err); }
    }
);

// ─── METRICS & REPORTING ─────────────────────────────────

// POST /api/franchise/clinics/:clinicId/metrics — Generate snapshot
router.post('/clinics/:clinicId/metrics',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const snapshot = await FranchiseService.generateMetricsSnapshot(
                req.params.clinicId, req.body.period
            );
            res.json(snapshot);
        } catch (err) { next(err); }
    }
);

// GET /api/franchise/network/:organizationId — Network overview
router.get('/network/:organizationId',
    authenticate,
    authorize('SUPER_ADMIN', 'ORG_ADMIN'),
    async (req, res, next) => {
        try {
            const overview = await FranchiseService.getNetworkOverview(req.params.organizationId);
            res.json(overview);
        } catch (err) { next(err); }
    }
);

module.exports = router;
