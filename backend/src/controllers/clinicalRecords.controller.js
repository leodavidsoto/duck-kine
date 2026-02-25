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
        const result = await clinicalRecordsService.getByPatient(req.params.patientId, { page: Number(page), limit: Number(limit) });
        res.json(result);
    } catch (error) { next(error); }
};

module.exports = { create, getById, update, getByPatient };
