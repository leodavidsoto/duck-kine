const corporateService = require('../services/corporate.service');

const submitContact = async (req, res, next) => {
    try {
        const client = await corporateService.submitContactForm(req.body);
        res.status(201).json({ message: 'Solicitud recibida', client });
    } catch (error) { next(error); }
};

const getPlans = async (req, res, next) => {
    try {
        const plans = await corporateService.getPlans();
        res.json({ plans });
    } catch (error) { next(error); }
};

const subscribe = async (req, res, next) => {
    try {
        const subscription = await corporateService.subscribe(req.body.clientId, req.body);
        res.status(201).json(subscription);
    } catch (error) { next(error); }
};

module.exports = { submitContact, getPlans, subscribe };
