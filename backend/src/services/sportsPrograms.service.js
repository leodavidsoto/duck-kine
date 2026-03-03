const prisma = require('../config/database');

class SportsProgramsService {
    // ─── Public (patients) ─────────────────────────────────
    async getAll({ page = 1, limit = 10, sport, level }) {
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        if (sport) where.sport = sport;
        if (level) where.level = level;

        const [programs, total] = await Promise.all([
            prisma.sportsProgram.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.sportsProgram.count({ where }),
        ]);
        return { programs, total, page, totalPages: Math.ceil(total / limit) };
    }

    async getById(id) {
        return prisma.sportsProgram.findUnique({ where: { id }, include: { phases: { orderBy: { orderIndex: 'asc' } }, enrollments: { select: { id: true } } } });
    }

    async enroll(patientId, programId) {
        const program = await prisma.sportsProgram.findUnique({ where: { id: programId } });
        if (!program) throw Object.assign(new Error('Programa no encontrado'), { statusCode: 404 });

        // Check if already enrolled
        const existing = await prisma.sportsProgramEnrollment.findFirst({
            where: { patientId, programId, status: 'ACTIVE' },
        });
        if (existing) throw Object.assign(new Error('Ya estás inscrito en este programa'), { statusCode: 400 });

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + program.durationWeeks * 7);

        return prisma.sportsProgramEnrollment.create({
            data: { patientId, programId, startDate, endDate },
            include: { program: true },
        });
    }

    async updateProgress(enrollmentId, progressData) {
        return prisma.sportsProgramEnrollment.update({
            where: { id: enrollmentId },
            data: { progressData },
        });
    }

    // ─── Admin CRUD ────────────────────────────────────────
    async getAllAdmin({ page = 1, limit = 50 }) {
        const skip = (page - 1) * limit;
        const [programs, total] = await Promise.all([
            prisma.sportsProgram.findMany({
                skip, take: limit,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { enrollments: true } } },
            }),
            prisma.sportsProgram.count(),
        ]);
        return { programs, total, page, totalPages: Math.ceil(total / limit) };
    }

    async create(data) {
        return prisma.sportsProgram.create({ data });
    }

    async update(id, data) {
        return prisma.sportsProgram.update({ where: { id }, data });
    }

    async remove(id) {
        // Soft delete
        return prisma.sportsProgram.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async getEnrollments({ page = 1, limit = 20, programId }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (programId) where.programId = programId;

        const [enrollments, total] = await Promise.all([
            prisma.sportsProgramEnrollment.findMany({
                where, skip, take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
                    program: { select: { name: true, sport: true } },
                },
            }),
            prisma.sportsProgramEnrollment.count({ where }),
        ]);
        return { enrollments, total, page, totalPages: Math.ceil(total / limit) };
    }
}

module.exports = new SportsProgramsService();
