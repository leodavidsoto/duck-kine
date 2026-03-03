const express = require('express');
const router = express.Router();
const trainingClassesController = require('../controllers/trainingClasses.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Public or basic auth to see upcoming classes
router.get('/', authenticate, trainingClassesController.getUpcomingClasses);

// Patient specific routes
router.get('/my-classes', authenticate, authorize('PATIENT'), trainingClassesController.getMyClasses);
router.post('/:id/book', authenticate, authorize('PATIENT'), trainingClassesController.bookClass);
router.put('/:id/confirm', authenticate, authorize('PATIENT'), trainingClassesController.confirmAttendance);

module.exports = router;
