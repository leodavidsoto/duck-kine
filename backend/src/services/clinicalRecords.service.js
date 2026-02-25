const prisma = require('../config/database');

class ClinicalRecordsService {
    async create(data) {
        return prisma.clinicalRecord.create({
            data,
            include: {
                patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                professional: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
    }

    async getById(id) {
        return prisma.clinicalRecord.findUnique({
            where: { id },
            include: {
                patient: { include: { user: { select: { firstName: true, lastName: true, rut: true } } } },
                professional: { include: { user: { select: { firstName: true, lastName: true } } } },
                appointment: { include: { service: true } },
            },
        });
    }

    async update(id, data) {
        return prisma.clinicalRecord.update({ where: { id }, data });
    }

    async getByPatient(patientId, { page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma.clinicalRecord.findMany({
                where: { patientId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    professional: { include: { user: { select: { firstName: true, lastName: true } } } },
                },
            }),
            prisma.clinicalRecord.count({ where: { patientId } }),
        ]);
        return { records, total, page, totalPages: Math.ceil(total / limit) };
    }
}

module.exports = new ClinicalRecordsService();
