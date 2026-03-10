const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const {
    verifyWebhook,
    handleWebhook,
    listConversations,
    getConversationMessages,
    sendManualMessage,
} = require('../controllers/whatsapp.controller');

const router = Router();

// ─── Public webhook endpoints (Meta calls these) ────────
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);

// ─── Protected admin/professional endpoints ─────────────
router.get('/conversations', authenticate, authorize('ADMIN', 'PROFESSIONAL', 'CLINIC_DIRECTOR'), listConversations);
router.get('/conversations/:id/messages', authenticate, authorize('ADMIN', 'PROFESSIONAL', 'CLINIC_DIRECTOR'), getConversationMessages);
router.post('/send', authenticate, authorize('ADMIN', 'PROFESSIONAL', 'CLINIC_DIRECTOR'), sendManualMessage);

module.exports = router;
