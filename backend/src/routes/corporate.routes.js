const router = require('express').Router();
const ctrl = require('../controllers/corporate.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.post('/contact', ctrl.submitContact);
router.get('/plans', ctrl.getPlans);
router.post('/subscribe', authenticate, authorize('ADMIN'), ctrl.subscribe);

module.exports = router;
