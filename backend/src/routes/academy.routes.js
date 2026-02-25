const router = require('express').Router();
const ctrl = require('../controllers/academy.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/courses', ctrl.getCourses);
router.get('/courses/:id', ctrl.getCourseDetail);
router.post('/courses/:id/enroll', authenticate, authorize('PATIENT'), ctrl.enroll);
router.put('/progress', authenticate, authorize('PATIENT'), ctrl.markLessonComplete);

module.exports = router;
