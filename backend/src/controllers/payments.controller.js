const paymentsService = require('../services/payments.service');
const prisma = require('../config/database');

const initPayment = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });
        const result = await paymentsService.initPayment({ patientId: patient.id, ...req.body });
        res.status(201).json(result);
    } catch (error) { next(error); }
};

const confirmPayment = async (req, res, next) => {
    try {
        const payment = await paymentsService.confirmPayment(req.params.id, req.body);
        res.json(payment);
    } catch (error) { next(error); }
};

const getMyPayments = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });
        const { page, limit } = req.query;
        const result = await paymentsService.getMyPayments(patient.id, { page: Number(page), limit: Number(limit) });
        res.json(result);
    } catch (error) { next(error); }
};

const getReceipt = async (req, res, next) => {
    try {
        const receipt = await paymentsService.getReceipt(req.params.id);
        if (!receipt) return res.status(404).json({ error: 'Pago no encontrado' });
        res.json(receipt);
    } catch (error) { next(error); }
};

module.exports = { initPayment, confirmPayment, getMyPayments, getReceipt };
