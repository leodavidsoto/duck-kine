const academyService = require('../services/academy.service');
const prisma = require('../config/database');

const getCourses = async (req, res, next) => {
    try {
        const { page, limit, category } = req.query;
        const result = await academyService.getCourses({ page: Number(page), limit: Number(limit), category });
        res.json(result);
    } catch (error) { next(error); }
};

const getCourseDetail = async (req, res, next) => {
    try {
        const course = await academyService.getCourseDetail(req.params.id);
        if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json(course);
    } catch (error) { next(error); }
};

const enroll = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        const enrollment = await academyService.enroll(patient.id, req.params.id);
        res.status(201).json(enrollment);
    } catch (error) { next(error); }
};

const markLessonComplete = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        const result = await academyService.markLessonComplete(patient.id, req.body.courseId);
        res.json(result);
    } catch (error) { next(error); }
};

module.exports = { getCourses, getCourseDetail, enroll, markLessonComplete };
