const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// All admin routes require PROFESSIONAL or ADMIN role
router.use(authenticate, authorize('PROFESSIONAL', 'ADMIN', 'CLINIC_DIRECTOR'));

// ─── Dashboard ──────────────────────────────────────
router.get('/stats', ctrl.getStats);

// ─── Appointments management ────────────────────────
router.get('/appointments/today', ctrl.getTodayAppointments);
router.patch('/appointments/:id/confirm', ctrl.confirmAppointment);
router.patch('/appointments/:id/complete', ctrl.completeAppointment);
router.patch('/appointments/:id/no-show', ctrl.markNoShow);

// ─── Patients ───────────────────────────────────────
router.get('/patients', ctrl.getPatients);
router.post('/patients', ctrl.createPatient);
router.get('/patients/:id/full', ctrl.getPatientFull);

// ─── Sessions ───────────────────────────────────────
router.get('/sessions', ctrl.getSessions);
router.post('/sessions', ctrl.createSession);

// ─── Revenue ────────────────────────────────────────
router.get('/revenue', ctrl.getRevenue);

module.exports = router;
