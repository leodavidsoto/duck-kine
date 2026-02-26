const adminService = require('../services/admin.service');
const patientsService = require('../services/patients.service');
const prisma = require('../config/database');

const getStats = async (req, res, next) => {
    try {
        const stats = await adminService.getDashboardStats(req.user.id);
        res.json(stats);
    } catch (error) { next(error); }
};

const getTodayAppointments = async (req, res, next) => {
    try {
        const appointments = await adminService.getTodayAppointments(req.user.id, req.query.date);
        res.json({ appointments });
    } catch (error) { next(error); }
};

const confirmAppointment = async (req, res, next) => {
    try {
        const result = await adminService.confirmAppointment(req.params.id);
        res.json(result);
    } catch (error) { next(error); }
};

const completeAppointment = async (req, res, next) => {
    try {
        const result = await adminService.completeAppointment(req.params.id, req.body);
        res.json(result);
    } catch (error) { next(error); }
};

const markNoShow = async (req, res, next) => {
    try {
        const result = await adminService.markNoShow(req.params.id);
        res.json(result);
    } catch (error) { next(error); }
};

const getPatients = async (req, res, next) => {
    try {
        const result = await patientsService.getAll(req.query);
        res.json(result);
    } catch (error) { next(error); }
};

const getPatientFull = async (req, res, next) => {
    try {
        const patient = await adminService.getPatientFull(req.params.id);
        res.json(patient);
    } catch (error) { next(error); }
};

const getSessions = async (req, res, next) => {
    try {
        const professional = await prisma.professional.findUnique({ where: { userId: req.user.id } });
        const profFilter = professional ? { professionalId: professional.id } : {};

        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [sessions, total] = await Promise.all([
            prisma.session.findMany({
                where: profFilter,
                skip, take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                    appointment: { include: { service: true } },
                },
            }),
            prisma.session.count({ where: profFilter }),
        ]);

        res.json({ sessions, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch (error) { next(error); }
};

const createSession = async (req, res, next) => {
    try {
        const session = await prisma.session.create({
            data: req.body,
            include: {
                patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                appointment: { include: { service: true } },
            },
        });
        res.status(201).json(session);
    } catch (error) { next(error); }
};

const getRevenue = async (req, res, next) => {
    try {
        const data = await adminService.getRevenueSummary();
        res.json(data);
    } catch (error) { next(error); }
};

const createPatient = async (req, res, next) => {
    try {
        // We use the auth service to register the patient, but generate a default password
        const authService = require('../services/auth.service');
        const defaultPassword = 'duckkine_temporal_123';

        const result = await authService.register({
            ...req.body,
            password: defaultPassword,
        });

        res.status(201).json({
            message: 'Paciente creado exitosamente',
            patient: result.user,
            defaultPassword,
        });
    } catch (error) { next(error); }
};

module.exports = {
    getStats, getTodayAppointments, confirmAppointment, completeAppointment,
    markNoShow, getPatients, getPatientFull, getSessions, createSession, getRevenue,
    createPatient,
};
