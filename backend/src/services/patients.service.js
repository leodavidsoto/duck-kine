const prisma = require('../config/database');

class PatientsService {
    async getProfile(userId) {
        return prisma.patient.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true, email: true, firstName: true, lastName: true,
                        rut: true, phone: true, role: true, avatarUrl: true,
                    },
                },
            },
        });
    }

    async updateProfile(userId, data) {
        return prisma.patient.update({
            where: { userId },
            data,
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true } },
            },
        });
    }

    async getAll({ page = 1, limit = 20, search }) {
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { rut: { contains: search } } },
            ],
        } : {};

        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                where, skip, take: limit,
                include: { user: { select: { id: true, email: true, firstName: true, lastName: true, rut: true, phone: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.patient.count({ where }),
        ]);

        return { patients, total, page, totalPages: Math.ceil(total / limit) };
    }

    async getById(id) {
        return prisma.patient.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, firstName: true, lastName: true, rut: true, phone: true } },
            },
        });
    }

    // ─── Treatment Goals ──────────────────────────────────
    async getGoals(userId) {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });

        return prisma.treatmentGoal.findMany({
            where: { patientId: patient.id },
            orderBy: { createdAt: 'desc' },
        });
    }

    // ─── Physical Assessments ─────────────────────────────
    async getAssessments(userId) {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });

        return prisma.physicalAssessment.findMany({
            where: { patientId: patient.id },
            orderBy: { assessmentDate: 'desc' },
            include: {
                professional: {
                    include: { user: { select: { firstName: true, lastName: true } } },
                },
                bodyMetrics: true,
            },
        });
    }

    // ─── Exercises (from sessions) ────────────────────────
    async getExercises(userId) {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });

        // Get exercises from the latest sessions that have homeExercises
        const sessions = await prisma.session.findMany({
            where: {
                patientId: patient.id,
                homeExercises: { not: null },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                homeExercises: true,
                exercisesPerformed: true,
                createdAt: true,
            },
        });

        return sessions;
    }

    // ─── Pain Records ─────────────────────────────────────
    async getPainRecords(userId) {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });

        return prisma.painRecord.findMany({
            where: { patientId: patient.id },
            orderBy: { recordedAt: 'desc' },
        });
    }

    async createPainRecord(userId, data) {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });

        return prisma.painRecord.create({
            data: {
                patientId: patient.id,
                evaScore: data.evaScore,
                painLevel: data.painLevel || 'MILD',
                location: data.location,
                context: data.context || null,
                notes: data.notes || null,
                recordedAt: new Date(),
            },
        });
    }

    // ─── Dashboard Stats ──────────────────────────────────
    async getStats(userId) {
        const patient = await prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });

        const now = new Date();

        const [upcomingAppointments, completedSessions, goals, latestPain] = await Promise.all([
            // Citas futuras (PENDING o CONFIRMED)
            prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    startTime: { gte: now },
                    status: { in: ['PENDING', 'CONFIRMED'] },
                },
            }),
            // Sesiones completadas
            prisma.session.count({
                where: { patientId: patient.id, status: 'COMPLETED' },
            }),
            // Objetivos terapéuticos para calcular progreso promedio
            prisma.treatmentGoal.findMany({
                where: { patientId: patient.id },
                select: { progressPercent: true },
            }),
            // Último registro de dolor
            prisma.painRecord.findFirst({
                where: { patientId: patient.id },
                orderBy: { recordedAt: 'desc' },
                select: { evaScore: true },
            }),
        ]);

        const progressPercent = goals.length > 0
            ? Math.round(goals.reduce((acc, g) => acc + Number(g.progressPercent || 0), 0) / goals.length)
            : 0;

        return {
            upcomingAppointments,
            completedSessions,
            progressPercent,
            latestEva: latestPain?.evaScore ?? null,
        };
    }
}

module.exports = new PatientsService();
