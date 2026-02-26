const prisma = require('../config/database');

class SchedulingService {
    /**
     * Get available time slots for a professional on a given date
     */
    async getAvailableSlots(professionalId, date, serviceDuration = 30) {
        const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const dateObj = new Date(date);
        const weekDay = dayOfWeek[dateObj.getDay()];

        // If no specific professional is requested, find all active professionals with schedules today
        let targetProfessionalIds = [];
        if (professionalId) {
            targetProfessionalIds = [professionalId];
        } else {
            const schedules = await prisma.schedule.findMany({
                where: { dayOfWeek: weekDay, isActive: true },
                select: { professionalId: true }
            });
            targetProfessionalIds = schedules.map(s => s.professionalId);
        }

        if (targetProfessionalIds.length === 0) return [];

        const slots = [];
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        for (const profId of targetProfessionalIds) {
            const professional = await prisma.professional.findUnique({
                where: { id: profId },
                include: { user: { select: { firstName: true, lastName: true } } }
            });

            const schedule = await prisma.schedule.findFirst({
                where: { professionalId: profId, dayOfWeek: weekDay },
            });

            if (!schedule || !schedule.isActive) continue;

            const existingAppointments = await prisma.appointment.findMany({
                where: {
                    professionalId: profId,
                    startTime: { gte: startOfDay, lte: endOfDay },
                    status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
                },
            });

            const [startHour, startMin] = schedule.startTime.split(':').map(Number);
            const [endHour, endMin] = schedule.endTime.split(':').map(Number);

            let current = new Date(date);
            current.setHours(startHour, startMin, 0, 0);

            const scheduleEnd = new Date(date);
            scheduleEnd.setHours(endHour, endMin, 0, 0);

            while (current < scheduleEnd) {
                const slotEnd = new Date(current.getTime() + serviceDuration * 60000);
                if (slotEnd > scheduleEnd) break;

                const isOccupied = existingAppointments.some((apt) => {
                    return current < new Date(apt.endTime) && slotEnd > new Date(apt.startTime);
                });

                if (!isOccupied) {
                    slots.push({
                        startTime: new Date(current),
                        endTime: new Date(slotEnd),
                        professional: professional
                    });
                }

                current = new Date(current.getTime() + serviceDuration * 60000);
            }
        }

        return slots.sort((a, b) => a.startTime - b.startTime);
    }

    async createAppointment({ patientId, professionalId, serviceId, startTime, notes }) {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) throw Object.assign(new Error('Servicio no encontrado'), { statusCode: 404 });

        const endTime = new Date(new Date(startTime).getTime() + service.durationMinutes * 60000);

        // Check availability
        const conflict = await prisma.appointment.findFirst({
            where: {
                professionalId,
                status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
                OR: [
                    { startTime: { lt: endTime }, endTime: { gt: new Date(startTime) } },
                ],
            },
        });

        if (conflict) {
            throw Object.assign(new Error('Horario no disponible'), { statusCode: 409 });
        }

        return prisma.appointment.create({
            data: { patientId, professionalId, serviceId, startTime: new Date(startTime), endTime, notes },
            include: {
                service: true,
                professional: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
    }

    async getMyAppointments(userId, role, { page = 1, limit = 20, status }) {
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 20;
        const skip = (pageNum - 1) * limitNum;
        let where = {};

        if (role === 'PATIENT') {
            const patient = await prisma.patient.findUnique({ where: { userId } });
            where.patientId = patient.id;
        } else if (role === 'PROFESSIONAL') {
            const professional = await prisma.professional.findUnique({ where: { userId } });
            where.professionalId = professional.id;
        }

        if (status) where.status = status;

        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { startTime: 'desc' },
                include: {
                    service: true,
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                    professional: { include: { user: { select: { firstName: true, lastName: true } } } },
                },
            }),
            prisma.appointment.count({ where }),
        ]);

        return { appointments, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
    }

    async updateAppointment(id, data) {
        return prisma.appointment.update({
            where: { id },
            data,
            include: { service: true },
        });
    }

    async cancelAppointment(id) {
        return prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
}

module.exports = new SchedulingService();
