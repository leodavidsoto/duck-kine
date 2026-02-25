const sportsProgramsService = require('../services/sportsPrograms.service');
const prisma = require('../config/database');

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

module.exports = { getAll, getById, enroll, updateProgress };
