const patientsService = require('../services/patients.service');

const getProfile = async (req, res, next) => {
    try {
        const profile = await patientsService.getProfile(req.user.id);
        if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });
        res.json(profile);
    } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
    try {
        const profile = await patientsService.updateProfile(req.user.id, req.body);
        res.json(profile);
    } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const result = await patientsService.getAll({ page: Number(page), limit: Number(limit), search });
        res.json(result);
    } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
    try {
        const patient = await patientsService.getById(req.params.id);
        if (!patient) return res.status(404).json({ error: 'Paciente no encontrado' });
        res.json(patient);
    } catch (error) { next(error); }
};

// ─── Goals ─────────────────────────────────────────────
const getGoals = async (req, res, next) => {
    try {
        const goals = await patientsService.getGoals(req.user.id);
        res.json({ goals });
    } catch (error) { next(error); }
};

// ─── Assessments ───────────────────────────────────────
const getAssessments = async (req, res, next) => {
    try {
        const assessments = await patientsService.getAssessments(req.user.id);
        res.json({ assessments });
    } catch (error) { next(error); }
};

// ─── Exercises ─────────────────────────────────────────
const getExercises = async (req, res, next) => {
    try {
        const exercises = await patientsService.getExercises(req.user.id);
        res.json({ exercises });
    } catch (error) { next(error); }
};

// ─── Pain Records ──────────────────────────────────────
const getPainRecords = async (req, res, next) => {
    try {
        const records = await patientsService.getPainRecords(req.user.id);
        res.json({ records });
    } catch (error) { next(error); }
};

const createPainRecord = async (req, res, next) => {
    try {
        const record = await patientsService.createPainRecord(req.user.id, req.body);
        res.status(201).json(record);
    } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await patientsService.getStats(req.user.id);
        res.json(stats);
    } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile, getAll, getById, getGoals, getAssessments, getExercises, getPainRecords, createPainRecord, getStats };
