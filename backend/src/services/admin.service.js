const prisma = require('../config/database');

class AdminService {
    /**
     * Dashboard KPIs for the professional
     */
    async getDashboardStats(userId) {
        const professional = await prisma.professional.findUnique({ where: { userId } });
        const profFilter = professional ? { professionalId: professional.id } : {};

        const now = new Date();
        const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now); endOfDay.setHours(23, 59, 59, 999);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const [
            todayAppointments,
            weekAppointments,
            totalPatients,
            newPatientsMonth,
            completedToday,
            monthRevenue,
            pendingPayments,
        ] = await Promise.all([
            prisma.appointment.count({
                where: { ...profFilter, startTime: { gte: startOfDay, lte: endOfDay }, status: { not: 'CANCELLED' } },
            }),
            prisma.appointment.count({
                where: { ...profFilter, startTime: { gte: startOfWeek, lte: endOfWeek }, status: { not: 'CANCELLED' } },
            }),
            prisma.patient.count(),
            prisma.patient.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.appointment.count({
                where: { ...profFilter, startTime: { gte: startOfDay, lte: endOfDay }, status: 'COMPLETED' },
            }),
            prisma.payment.aggregate({
                where: { status: 'APPROVED', paidAt: { gte: startOfMonth } },
                _sum: { totalAmount: true },
            }),
            prisma.payment.count({ where: { status: 'PENDING' } }),
        ]);

        return {
            todayAppointments,
            weekAppointments,
            totalPatients,
            newPatientsMonth,
            completedToday,
            monthRevenue: Number(monthRevenue._sum.totalAmount || 0),
            pendingPayments,
        };
    }

    /**
     * Appointments for today (or a given date)
     */
    async getTodayAppointments(userId, dateStr) {
        const professional = await prisma.professional.findUnique({ where: { userId } });
        const profFilter = professional ? { professionalId: professional.id } : {};

        const date = dateStr ? new Date(dateStr) : new Date();
        const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);

        return prisma.appointment.findMany({
            where: {
                ...profFilter,
                startTime: { gte: startOfDay, lte: endOfDay },
            },
            orderBy: { startTime: 'asc' },
            include: {
                patient: { include: { user: { select: { firstName: true, lastName: true, rut: true, phone: true } } } },
                service: true,
                professional: { include: { user: { select: { firstName: true, lastName: true } } } },
                session: true,
            },
        });
    }

    /**
     * Change appointment status
     */
    async confirmAppointment(id) {
        return prisma.appointment.update({
            where: { id }, data: { status: 'CONFIRMED' },
            include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } }, service: true },
        });
    }

    async markNoShow(id) {
        return prisma.appointment.update({
            where: { id }, data: { status: 'NO_SHOW' },
        });
    }

    /**
     * Complete appointment → creates a Session
     */
    async completeAppointment(id, sessionData = {}) {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: { session: true },
        });
        if (!appointment) throw Object.assign(new Error('Cita no encontrada'), { statusCode: 404 });

        // Count existing sessions for this patient to set sessionNumber
        const sessionCount = await prisma.session.count({
            where: { patientId: appointment.patientId },
        });

        const result = await prisma.$transaction([
            prisma.appointment.update({
                where: { id }, data: { status: 'COMPLETED' },
            }),
            // Create session if doesn't exist
            ...(appointment.session ? [] : [
                prisma.session.create({
                    data: {
                        appointmentId: id,
                        patientId: appointment.patientId,
                        professionalId: appointment.professionalId,
                        clinicId: appointment.clinicId,
                        sessionNumber: sessionCount + 1,
                        status: 'COMPLETED',
                        actualStartTime: appointment.startTime,
                        actualEndTime: new Date(),
                        durationMinutes: Math.round((new Date() - new Date(appointment.startTime)) / 60000),
                        observations: sessionData.observations || null,
                        homeExercises: sessionData.homeExercises || null,
                        painBefore: sessionData.painBefore ?? null,
                        painAfter: sessionData.painAfter ?? null,
                        techniques: sessionData.techniques || null,
                        exercisesPerformed: sessionData.exercisesPerformed || null,
                        recommendations: sessionData.recommendations || null,
                        nextSessionGoal: sessionData.nextSessionGoal || null,
                        progressRating: sessionData.progressRating ?? null,
                        progressNotes: sessionData.progressNotes || null,
                    },
                }),
            ]),
        ]);

        return result;
    }

    /**
     * Full patient detail with history
     */
    async getPatientFull(patientId) {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                user: {
                    select: {
                        id: true, email: true, firstName: true, lastName: true,
                        rut: true, phone: true, avatarUrl: true, createdAt: true,
                    },
                },
                appointments: {
                    orderBy: { startTime: 'desc' },
                    take: 20,
                    include: { service: true, professional: { include: { user: { select: { firstName: true, lastName: true } } } } },
                },
                sessions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                painRecords: {
                    orderBy: { recordedAt: 'desc' },
                    take: 20,
                },
                treatmentGoals: {
                    orderBy: { createdAt: 'desc' },
                },
                physicalAssessments: {
                    orderBy: { assessmentDate: 'desc' },
                    take: 5,
                    include: { professional: { include: { user: { select: { firstName: true, lastName: true } } } } },
                },
                clinicalRecords: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { professional: { include: { user: { select: { firstName: true, lastName: true } } } } },
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { appointment: { include: { service: true } } },
                },
            },
        });

        if (!patient) throw Object.assign(new Error('Paciente no encontrado'), { statusCode: 404 });
        return patient;
    }

    /**
     * Revenue summary
     */
    async getRevenueSummary() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const [thisMonth, prevMonth, recentPayments, byMethod] = await Promise.all([
            prisma.payment.aggregate({
                where: { status: 'APPROVED', paidAt: { gte: startOfMonth } },
                _sum: { totalAmount: true },
                _count: true,
            }),
            prisma.payment.aggregate({
                where: { status: 'APPROVED', paidAt: { gte: prevMonthStart, lte: prevMonthEnd } },
                _sum: { totalAmount: true },
                _count: true,
            }),
            prisma.payment.findMany({
                orderBy: { createdAt: 'desc' },
                take: 30,
                include: {
                    patient: { include: { user: { select: { firstName: true, lastName: true } } } },
                    appointment: { include: { service: true } },
                },
            }),
            prisma.payment.groupBy({
                by: ['method'],
                where: { status: 'APPROVED', paidAt: { gte: startOfMonth } },
                _sum: { totalAmount: true },
                _count: true,
            }),
        ]);

        return {
            thisMonth: { total: Number(thisMonth._sum.totalAmount || 0), count: thisMonth._count },
            prevMonth: { total: Number(prevMonth._sum.totalAmount || 0), count: prevMonth._count },
            recentPayments,
            byMethod,
        };
    }
}

module.exports = new AdminService();
