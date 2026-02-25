const router = require('express').Router();
const ctrl = require('../controllers/clinicalRecords.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.post('/', authenticate, authorize('PROFESSIONAL', 'ADMIN'), ctrl.create);
router.get('/:id', authenticate, ctrl.getById);
router.put('/:id', authenticate, authorize('PROFESSIONAL', 'ADMIN'), ctrl.update);
router.get('/patient/:patientId', authenticate, ctrl.getByPatient);

module.exports = router;
