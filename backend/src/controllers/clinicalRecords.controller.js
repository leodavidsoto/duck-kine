const clinicalRecordsService = require('../services/clinicalRecords.service');

const create = async (req, res, next) => {
    try {
        const record = await clinicalRecordsService.create(req.body);
        res.status(201).json(record);
    } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
    try {
        const record = await clinicalRecordsService.getById(req.params.id);
        if (!record) return res.status(404).json({ error: 'Ficha no encontrada' });
        res.json(record);
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const record = await clinicalRecordsService.update(req.params.id, req.body);
        res.json(record);
    } catch (error) { next(error); }
};

const getByPatient = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        let { patientId } = req.params;

        // Resolve 'me' to the actual patient ID
        if (patientId === 'me') {
            const prisma = require('../config/database');
            const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
            if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });
            patientId = patient.id;
        }

        const safePage = parseInt(page) || 1;
        const safeLimit = parseInt(limit) || 10;
        const result = await clinicalRecordsService.getByPatient(patientId, { page: safePage, limit: safeLimit });
        res.json(result);
    } catch (error) { next(error); }
};

module.exports = { create, getById, update, getByPatient };
