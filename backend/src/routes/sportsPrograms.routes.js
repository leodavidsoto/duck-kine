const router = require('express').Router();
const ctrl = require('../controllers/sportsPrograms.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/:id/enroll', authenticate, authorize('PATIENT'), ctrl.enroll);
router.put('/progress', authenticate, authorize('PATIENT'), ctrl.updateProgress);

module.exports = router;
