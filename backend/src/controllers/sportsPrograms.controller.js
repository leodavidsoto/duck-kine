const sportsProgramsService = require('../services/sportsPrograms.service');
const prisma = require('../config/database');

// ─── Public ────────────────────────────────────────
const getAll = async (req, res, next) => {
    try {
        const { page, limit, sport, level } = req.query;
        const result = await sportsProgramsService.getAll({ page: Number(page), limit: Number(limit), sport, level });
        res.json(result);
    } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
    try {
        const program = await sportsProgramsService.getById(req.params.id);
        if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
        res.json(program);
    } catch (error) { next(error); }
};

const enroll = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Paciente no encontrado' });
        const enrollment = await sportsProgramsService.enroll(patient.id, req.params.id);
        res.status(201).json(enrollment);
    } catch (error) { next(error); }
};

const updateProgress = async (req, res, next) => {
    try {
        const enrollment = await sportsProgramsService.updateProgress(req.body.enrollmentId, req.body.progressData);
        res.json(enrollment);
    } catch (error) { next(error); }
};

// ─── Admin ─────────────────────────────────────────
const getAllAdmin = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await sportsProgramsService.getAllAdmin({ page: Number(page) || 1, limit: Number(limit) || 50 });
        res.json(result);
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const program = await sportsProgramsService.create(req.body);
        res.status(201).json(program);
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const program = await sportsProgramsService.update(req.params.id, req.body);
        res.json(program);
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    try {
        await sportsProgramsService.remove(req.params.id);
        res.json({ message: 'Programa desactivado' });
    } catch (error) { next(error); }
};

const getEnrollments = async (req, res, next) => {
    try {
        const { page, limit, programId } = req.query;
        const result = await sportsProgramsService.getEnrollments({ page: Number(page) || 1, limit: Number(limit) || 20, programId });
        res.json(result);
    } catch (error) { next(error); }
};

module.exports = { getAll, getById, enroll, updateProgress, getAllAdmin, create, update, remove, getEnrollments };
