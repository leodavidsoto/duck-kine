const prisma = require('../config/database');

class SportsProgramsService {
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
        return prisma.sportsProgram.findUnique({ where: { id }, include: { enrollments: { select: { id: true } } } });
    }

    async enroll(patientId, programId) {
        const program = await prisma.sportsProgram.findUnique({ where: { id: programId } });
        if (!program) throw Object.assign(new Error('Programa no encontrado'), { statusCode: 404 });

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
}

module.exports = new SportsProgramsService();
