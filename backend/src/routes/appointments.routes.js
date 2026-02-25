const router = require('express').Router();
const ctrl = require('../controllers/appointments.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { validate } = require('../middleware/validate');
const { createAppointmentSchema, updateAppointmentSchema } = require('../validators/appointment.schema');

router.get('/available', ctrl.getAvailableSlots);
router.post('/', authenticate, authorize('PATIENT', 'ADMIN'), validate(createAppointmentSchema), ctrl.createAppointment);
router.get('/my', authenticate, ctrl.getMyAppointments);
router.put('/:id', authenticate, validate(updateAppointmentSchema), ctrl.updateAppointment);
router.delete('/:id', authenticate, ctrl.cancelAppointment);

module.exports = router;
