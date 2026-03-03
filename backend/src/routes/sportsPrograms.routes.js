const router = require('express').Router();
const ctrl = require('../controllers/sportsPrograms.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Patient
router.post('/:id/enroll', authenticate, authorize('PATIENT'), ctrl.enroll);
router.put('/progress', authenticate, authorize('PATIENT'), ctrl.updateProgress);

// Admin (PROFESSIONAL role)
router.get('/admin/all', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.getAllAdmin);
router.get('/admin/enrollments', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.getEnrollments);
router.post('/admin/create', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.create);
router.put('/admin/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.update);
router.delete('/admin/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN', 'SUPER_ADMIN'), ctrl.remove);

module.exports = router;
