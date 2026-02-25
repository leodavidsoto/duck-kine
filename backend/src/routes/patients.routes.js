const router = require('express').Router();
const ctrl = require('../controllers/patients.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { updatePatientSchema } = require('../validators/patient.schema');

// ─── Patient profile ─────────────────────────────────
router.get('/me', authenticate, authorize('PATIENT'), ctrl.getProfile);
router.put('/me', authenticate, authorize('PATIENT'), validate(updatePatientSchema), ctrl.updateProfile);

// ─── Patient sub-resources ────────────────────────────
router.get('/me/goals', authenticate, authorize('PATIENT'), ctrl.getGoals);
router.get('/me/assessments', authenticate, authorize('PATIENT'), ctrl.getAssessments);
router.get('/me/exercises', authenticate, authorize('PATIENT'), ctrl.getExercises);
router.get('/me/stats', authenticate, authorize('PATIENT'), ctrl.getStats);
router.get('/me/pain-records', authenticate, authorize('PATIENT'), ctrl.getPainRecords);
router.post('/me/pain-records', authenticate, authorize('PATIENT'), ctrl.createPainRecord);

// ─── Admin access ────────────────────────────────────
router.get('/', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.getAll);
router.get('/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.getById);

module.exports = router;
