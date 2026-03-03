const router = require('express').Router();
const ctrl = require('../controllers/payments.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { initPaymentSchema } = require('../validators/payment.schema');

router.post('/init', authenticate, authorize('PATIENT'), validate(initPaymentSchema), ctrl.initPayment);
router.post('/confirm', ctrl.confirmPayment); // Webpay POST callback — no auth
router.get('/confirm', ctrl.confirmPayment); // Webpay GET callback — no auth
router.get('/my', authenticate, authorize('PATIENT'), ctrl.getMyPayments);
router.get('/receipt/:id', authenticate, ctrl.getReceipt);

module.exports = router;
