/**
 * Patient Journey Automation Service
 * ═══════════════════════════════════════════════════════
 * Automated flow: Booking → Confirmation → Reminder → Session → Follow-up
 * 
 * Step 1: Patient books → instant confirmation (email + SMS + notification)
 * Step 2: 24h before → automated reminder with reschedule option  
 * Step 3: Session starts → kinesiólogo registers treatment in Session model
 * Step 4: Session ends → auto-send summary + home exercises + pain survey
 * Step 5: 48h after → follow-up check + progress review notification
 */

const prisma = require('../config/database');
const NotificationService = require('./notification.service');

class PatientJourneyService {

    // ─── STEP 1: Booking Confirmation ──────────────────────
    // Triggered immediately when appointment is created
    static async onAppointmentBooked(appointmentId) {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: { include: { user: true } },
                professional: { include: { user: true } },
                service: true,
            },
        });

        if (!appointment) throw new Error('Cita no encontrada');

        // Create confirmation notification
        await NotificationService.create({
            userId: appointment.patient.userId,
            title: '✅ Cita confirmada',
            message: `Tu hora de ${appointment.service.name} con ${appointment.professional.user.firstName} ${appointment.professional.user.lastName} el ${formatDate(appointment.startTime)} a las ${formatTime(appointment.startTime)} ha sido confirmada.`,
            type: 'APPOINTMENT',
            actionUrl: '/dashboard',
        });

        // Update appointment flags
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { confirmationSent: true },
        });

        // Queue email (stub — integrar con servicio de email)
        await this.sendEmail(appointment.patient.user.email, {
            subject: `Cita confirmada — ${appointment.service.name}`,
            template: 'appointment-confirmation',
            data: {
                patientName: appointment.patient.user.firstName,
                service: appointment.service.name,
                professional: `${appointment.professional.user.firstName} ${appointment.professional.user.lastName}`,
                date: formatDate(appointment.startTime),
                time: formatTime(appointment.startTime),
                duration: appointment.service.durationMinutes,
                location: 'Duck Kinesiología — Providencia, Santiago',
                cancelUrl: `/appointments/${appointmentId}/cancel`,
                rescheduleUrl: `/appointments/${appointmentId}/reschedule`,
            },
        });

        return { success: true, step: 'confirmation' };
    }

    // ─── STEP 2: 24h Reminder ──────────────────────────────
    // Called by CRON scheduler every hour
    static async sendReminders() {
        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

        // Find appointments 24h from now that haven't been reminded
        const upcomingAppointments = await prisma.appointment.findMany({
            where: {
                startTime: { gte: in24h, lt: in25h },
                status: { in: ['PENDING', 'CONFIRMED'] },
                reminderSent: false,
            },
            include: {
                patient: { include: { user: true } },
                professional: { include: { user: true } },
                service: true,
            },
        });

        const results = [];

        for (const apt of upcomingAppointments) {
            // Notification
            await NotificationService.create({
                userId: apt.patient.userId,
                title: '🔔 Recordatorio de cita — mañana',
                message: `Recuerda tu hora de ${apt.service.name} mañana a las ${formatTime(apt.startTime)} con ${apt.professional.user.firstName}. ¿Necesitas reagendar?`,
                type: 'APPOINTMENT',
                actionUrl: `/appointments/${apt.id}`,
            });

            // Email
            await this.sendEmail(apt.patient.user.email, {
                subject: `Recordatorio: ${apt.service.name} mañana`,
                template: 'appointment-reminder',
                data: {
                    patientName: apt.patient.user.firstName,
                    service: apt.service.name,
                    date: formatDate(apt.startTime),
                    time: formatTime(apt.startTime),
                    professional: apt.professional.user.firstName,
                    rescheduleUrl: `/appointments/${apt.id}/reschedule`,
                    preparations: this.getPreparations(apt.service.category),
                },
            });

            // Mark as reminded
            await prisma.appointment.update({
                where: { id: apt.id },
                data: { reminderSent: true },
            });

            results.push({ appointmentId: apt.id, patientId: apt.patientId });
        }

        return { sent: results.length, appointments: results };
    }

    // ─── STEP 3: Session Start ─────────────────────────────
    // Triggered when professional starts the session
    static async onSessionStart(appointmentId, professionalId) {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: true, service: true },
        });

        if (!appointment) throw new Error('Cita no encontrada');

        // Count previous sessions for this patient
        const sessionCount = await prisma.session.count({
            where: { patientId: appointment.patientId },
        });

        // Create session record
        const session = await prisma.session.create({
            data: {
                appointmentId,
                patientId: appointment.patientId,
                professionalId,
                sessionNumber: sessionCount + 1,
                status: 'IN_PROGRESS',
                actualStartTime: new Date(),
            },
        });

        // Update appointment status
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'IN_PROGRESS' },
        });

        return session;
    }

    // ─── STEP 4: Post-Session Summary ─────────────────────
    // Triggered when professional completes the session
    static async onSessionComplete(sessionId, sessionData) {
        const session = await prisma.session.update({
            where: { id: sessionId },
            data: {
                status: 'COMPLETED',
                actualEndTime: new Date(),
                durationMinutes: sessionData.durationMinutes,
                techniques: sessionData.techniques,
                exercisesPerformed: sessionData.exercisesPerformed,
                modalities: sessionData.modalities,
                painBefore: sessionData.painBefore,
                painAfter: sessionData.painAfter,
                observations: sessionData.observations,
                homeExercises: sessionData.homeExercises,
                recommendations: sessionData.recommendations,
                nextSessionGoal: sessionData.nextSessionGoal,
                progressRating: sessionData.progressRating,
                progressNotes: sessionData.progressNotes,
            },
            include: {
                patient: { include: { user: true } },
                professional: { include: { user: true } },
                appointment: { include: { service: true } },
            },
        });

        // Update appointment to completed
        await prisma.appointment.update({
            where: { id: session.appointmentId },
            data: { status: 'COMPLETED' },
        });

        // Auto-record pain if provided
        if (sessionData.painAfter !== undefined) {
            await prisma.painRecord.create({
                data: {
                    patientId: session.patientId,
                    location: sessionData.painLocation || 'General',
                    painLevel: this.evaToPainLevel(sessionData.painAfter),
                    evaScore: sessionData.painAfter,
                    context: 'Post sesión de tratamiento',
                },
            });
        }

        // Notify patient with session summary
        const summaryLines = [
            `Sesión #${session.sessionNumber} completada.`,
            sessionData.painBefore != null ? `Dolor: ${sessionData.painBefore}/10 → ${sessionData.painAfter}/10` : null,
            sessionData.homeExercises ? `Ejercicios para casa asignados.` : null,
            sessionData.nextSessionGoal ? `Próximo objetivo: ${sessionData.nextSessionGoal}` : null,
        ].filter(Boolean);

        await NotificationService.create({
            userId: session.patient.userId,
            title: '📋 Resumen de tu sesión',
            message: summaryLines.join('\n'),
            type: 'SESSION',
            actionUrl: '/historial',
        });

        // Email summary
        await this.sendEmail(session.patient.user.email, {
            subject: `Resumen sesión #${session.sessionNumber} — ${session.appointment.service.name}`,
            template: 'session-summary',
            data: {
                patientName: session.patient.user.firstName,
                sessionNumber: session.sessionNumber,
                service: session.appointment.service.name,
                professional: `${session.professional.user.firstName} ${session.professional.user.lastName}`,
                painBefore: sessionData.painBefore,
                painAfter: sessionData.painAfter,
                techniques: sessionData.techniques,
                homeExercises: sessionData.homeExercises,
                recommendations: sessionData.recommendations,
                nextGoal: sessionData.nextSessionGoal,
                progressRating: sessionData.progressRating,
            },
        });

        // Schedule 48h follow-up
        await this.scheduleFollowUp(session);

        return session;
    }

    // ─── STEP 5: 48h Follow-up ────────────────────────────
    // Called by CRON scheduler
    static async sendFollowUps() {
        const now = new Date();
        const ago48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        const ago49h = new Date(now.getTime() - 49 * 60 * 60 * 1000);

        // Find sessions completed ~48h ago
        const recentSessions = await prisma.session.findMany({
            where: {
                status: 'COMPLETED',
                actualEndTime: { gte: ago49h, lt: ago48h },
            },
            include: {
                patient: { include: { user: true } },
                professional: { include: { user: true } },
                appointment: { include: { service: true } },
            },
        });

        const results = [];

        for (const session of recentSessions) {
            await NotificationService.create({
                userId: session.patient.userId,
                title: '💬 ¿Cómo te sientes después de tu sesión?',
                message: `Han pasado 48h desde tu sesión de ${session.appointment.service.name}. Registra tu nivel de dolor actual para que tu kinesiólogo pueda hacer seguimiento.`,
                type: 'PROGRESS',
                actionUrl: '/dolor',
            });

            await this.sendEmail(session.patient.user.email, {
                subject: `¿Cómo te sientes? — Seguimiento post sesión`,
                template: 'follow-up',
                data: {
                    patientName: session.patient.user.firstName,
                    service: session.appointment.service.name,
                    sessionNumber: session.sessionNumber,
                    homeExercises: session.homeExercises,
                    painSurveyUrl: '/dolor',
                    progressUrl: '/progreso',
                },
            });

            results.push({ sessionId: session.id, patientId: session.patientId });
        }

        return { sent: results.length, sessions: results };
    }

    // ─── NO-SHOW Detection ────────────────────────────────
    // Called by CRON: marks appointments as NO_SHOW if 30min past start
    static async detectNoShows() {
        const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);

        const noShows = await prisma.appointment.updateMany({
            where: {
                status: { in: ['PENDING', 'CONFIRMED'] },
                startTime: { lt: thirtyMinAgo },
            },
            data: { status: 'NO_SHOW' },
        });

        return { marked: noShows.count };
    }

    // ─── Upcoming Session Prep ─────────────────────────────
    // Provides kinesiólogo with patient context before session
    static async getSessionPrep(appointmentId) {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: {
                    include: {
                        user: true,
                        clinicalRecords: { orderBy: { createdAt: 'desc' }, take: 1 },
                        painRecords: { orderBy: { recordedAt: 'desc' }, take: 5 },
                        treatmentGoals: { where: { isAchieved: false } },
                        bodyMetrics: { orderBy: { measuredAt: 'desc' }, take: 1 },
                    },
                },
                service: true,
            },
        });

        if (!appointment) throw new Error('Cita no encontrada');

        const lastSession = await prisma.session.findFirst({
            where: { patientId: appointment.patientId },
            orderBy: { createdAt: 'desc' },
        });

        return {
            appointment,
            lastSession,
            lastClinicalRecord: appointment.patient.clinicalRecords[0] || null,
            recentPain: appointment.patient.painRecords,
            activeGoals: appointment.patient.treatmentGoals,
            latestMetrics: appointment.patient.bodyMetrics[0] || null,
        };
    }

    // ─── Helpers ───────────────────────────────────────────
    static async sendEmail(to, emailData) {
        // Stub — integrate with SendGrid, Resend, or similar
        console.log(`📧 Email to ${to}: ${emailData.subject}`);
        // TODO: implement actual email sending
        return { sent: true, to, subject: emailData.subject };
    }

    static async scheduleFollowUp(session) {
        // In production, use a job queue (Bull, Agenda, etc.)
        // For now, the CRON job handles this via time-based queries
        console.log(`⏰ Follow-up scheduled for session #${session.sessionNumber} in 48h`);
    }

    static getPreparations(serviceCategory) {
        const preps = {
            'Kinesiología': 'Trae ropa cómoda. Llega 5 minutos antes.',
            'Deportiva': 'Trae ropa deportiva y zapatillas. Llega 10 minutos antes para calentar.',
            'Neurológica': 'Trae tu historial médico actualizado.',
            default: 'Trae ropa cómoda y llega 5 minutos antes de tu cita.',
        };
        return preps[serviceCategory] || preps.default;
    }

    static evaToPainLevel(eva) {
        if (eva === 0) return 'NONE';
        if (eva <= 3) return 'MILD';
        if (eva <= 6) return 'MODERATE';
        if (eva <= 8) return 'SEVERE';
        return 'EXTREME';
    }
}

// ─── Date formatting helpers (Chilean locale) ──────────
function formatDate(date) {
    return new Intl.DateTimeFormat('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Santiago',
    }).format(new Date(date));
}

function formatTime(date) {
    return new Intl.DateTimeFormat('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Santiago',
    }).format(new Date(date));
}

module.exports = PatientJourneyService;
