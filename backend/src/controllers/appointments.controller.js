const schedulingService = require('../services/scheduling.service');
const prisma = require('../config/database');

const getAvailableSlots = async (req, res, next) => {
    try {
        const { professionalId, date, duration } = req.query;
        const slots = await schedulingService.getAvailableSlots(professionalId, date, Number(duration) || 30);
        res.json({ slots });
    } catch (error) { next(error); }
};

const createAppointment = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });

        const appointment = await schedulingService.createAppointment({
            patientId: patient.id,
            ...req.body,
        });
        res.status(201).json(appointment);
    } catch (error) { next(error); }
};

const getMyAppointments = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const result = await schedulingService.getMyAppointments(req.user.id, req.user.role, {
            page: Number(page), limit: Number(limit), status,
        });
        res.json(result);
    } catch (error) { next(error); }
};

const updateAppointment = async (req, res, next) => {
    try {
        const appointment = await schedulingService.updateAppointment(req.params.id, req.body);
        res.json(appointment);
    } catch (error) { next(error); }
};

const cancelAppointment = async (req, res, next) => {
    try {
        const appointment = await schedulingService.cancelAppointment(req.params.id);
        res.json(appointment);
    } catch (error) { next(error); }
};

module.exports = { getAvailableSlots, createAppointment, getMyAppointments, updateAppointment, cancelAppointment };
