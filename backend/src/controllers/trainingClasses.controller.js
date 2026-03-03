const prisma = require('../config/database');

const ACTIVE_BOOKING_STATUSES = ['BOOKED', 'CONFIRMED', 'ATTENDED'];

// GET /api/training-classes
const getUpcomingClasses = async (req, res, next) => {
    try {
        const classes = await prisma.trainingClass.findMany({
            where: { startTime: { gte: new Date() } },
            include: {
                trainer: {
                    select: {
                        user: { select: { firstName: true, lastName: true, avatarUrl: true } }
                    }
                },
                _count: {
                    select: { bookings: { where: { status: { in: ACTIVE_BOOKING_STATUSES } } } }
                }
            },
            orderBy: { startTime: 'asc' }
        });
        res.json(classes);
    } catch (error) { next(error); }
};

// GET /api/training-classes/my-classes
const getMyClasses = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });

        const bookings = await prisma.classBooking.findMany({
            where: { patientId: patient.id },
            include: {
                trainingClass: {
                    include: {
                        trainer: {
                            select: {
                                user: { select: { firstName: true, lastName: true, avatarUrl: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { trainingClass: { startTime: 'desc' } }
        });
        res.json(bookings);
    } catch (error) { next(error); }
};

// POST /api/training-classes/:id/book
const bookClass = async (req, res, next) => {
    try {
        const classId = req.params.id;
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });

        // Use transaction to prevent race conditions on capacity check + booking
        const result = await prisma.$transaction(async (tx) => {
            const trainingClass = await tx.trainingClass.findUnique({
                where: { id: classId },
                include: {
                    _count: {
                        select: { bookings: { where: { status: { in: ACTIVE_BOOKING_STATUSES } } } }
                    }
                }
            });

            if (!trainingClass) {
                throw Object.assign(new Error('Clase no encontrada'), { statusCode: 404 });
            }

            if (trainingClass._count.bookings >= trainingClass.capacity) {
                throw Object.assign(new Error('La clase ya está llena'), { statusCode: 400 });
            }

            if (new Date(trainingClass.startTime) < new Date()) {
                throw Object.assign(new Error('No puedes reservar una clase que ya comenzó o pasó'), { statusCode: 400 });
            }

            const existingBooking = await tx.classBooking.findUnique({
                where: { classId_patientId: { classId, patientId: patient.id } }
            });

            if (existingBooking) {
                if (existingBooking.status === 'CANCELLED') {
                    return tx.classBooking.update({
                        where: { id: existingBooking.id },
                        data: { status: 'BOOKED' }
                    });
                }
                throw Object.assign(new Error('Ya tienes una reserva activa para esta clase'), { statusCode: 400 });
            }

            return tx.classBooking.create({
                data: { classId, patientId: patient.id, status: 'BOOKED' }
            });
        });

        res.status(201).json(result);
    } catch (error) { next(error); }
};

// PUT /api/training-classes/:id/confirm
const confirmAttendance = async (req, res, next) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
        if (!patient) return res.status(404).json({ error: 'Perfil de paciente no encontrado' });

        const booking = await prisma.classBooking.findUnique({
            where: { classId_patientId: { classId: req.params.id, patientId: patient.id } }
        });

        if (!booking) return res.status(404).json({ error: 'No tienes una reserva para esta clase' });
        if (booking.status === 'CANCELLED') return res.status(400).json({ error: 'Tu reserva está cancelada' });

        const updatedBooking = await prisma.classBooking.update({
            where: { id: booking.id },
            data: { status: 'CONFIRMED' }
        });
        res.json(updatedBooking);
    } catch (error) { next(error); }
};

module.exports = { getUpcomingClasses, getMyClasses, bookClass, confirmAttendance };
