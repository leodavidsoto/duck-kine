const router = require('express').Router();
const { register, login } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth.schema');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);

module.exports = router;
