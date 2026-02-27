const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) { next(error); }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error) { next(error); }
};

const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body);
        res.json(result);
    } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
    try {
        const result = await authService.resetPassword(req.body);
        res.json(result);
    } catch (error) { next(error); }
};

module.exports = { register, login, forgotPassword, resetPassword };
