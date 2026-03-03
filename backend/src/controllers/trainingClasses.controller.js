const prisma = require('../config/database');

// GET /api/training-classes
// Get all future training classes
const getUpcomingClasses = async (req, res) => {
    try {
        const classes = await prisma.trainingClass.findMany({
            where: {
                startTime: {
                    gte: new Date()
                }
            },
            include: {
                trainer: {
                    select: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatarUrl: true
                            }
                        }
                    }
                },
                _count: {
                    select: { bookings: { where: { status: { in: ['BOOKED', 'CONFIRMED', 'ATTENDED'] } } } }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        res.json(classes);
    } catch (error) {
        console.error('Error fetching upcoming classes:', error);
        res.status(500).json({ message: 'Error al obtener las clases de entrenamiento' });
    }
};

// GET /api/training-classes/my-classes
// Get classes booked by the current patient
const getMyClasses = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find patient profile
        const patient = await prisma.patient.findUnique({
            where: { userId }
        });

        if (!patient) {
            return res.status(404).json({ message: 'Perfil de paciente no encontrado' });
        }

        const bookings = await prisma.classBooking.findMany({
            where: {
                patientId: patient.id,
            },
            include: {
                trainingClass: {
                    include: {
                        trainer: {
                            select: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        avatarUrl: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                trainingClass: {
                    startTime: 'desc'
                }
            }
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching my classes:', error);
        res.status(500).json({ message: 'Error al obtener mis reservas de clase' });
    }
};

// POST /api/training-classes/:id/book
// Book a spot in a class
const bookClass = async (req, res) => {
    try {
        const classId = req.params.id;
        const userId = req.user.id;

        // Find patient profile
        const patient = await prisma.patient.findUnique({
            where: { userId }
        });

        if (!patient) {
            return res.status(404).json({ message: 'Perfil de paciente no encontrado' });
        }

        // Check if class exists and is not full
        const trainingClass = await prisma.trainingClass.findUnique({
            where: { id: classId },
            include: {
                _count: {
                    select: { bookings: { where: { status: { in: ['BOOKED', 'CONFIRMED', 'ATTENDED'] } } } }
                }
            }
        });

        if (!trainingClass) {
            return res.status(404).json({ message: 'Clase no encontrada' });
        }

        if (trainingClass._count.bookings >= trainingClass.capacity) {
            return res.status(400).json({ message: 'La clase ya está llena' });
        }

        // Check if passed
        if (new Date(trainingClass.startTime) < new Date()) {
            return res.status(400).json({ message: 'No puedes reservar una clase que ya comenzó o pasó' });
        }

        // Check if already booked
        const existingBooking = await prisma.classBooking.findUnique({
            where: {
                classId_patientId: {
                    classId,
                    patientId: patient.id
                }
            }
        });

        if (existingBooking) {
            if (existingBooking.status === 'CANCELLED') {
                // Re-book
                const updatedBooking = await prisma.classBooking.update({
                    where: { id: existingBooking.id },
                    data: { status: 'BOOKED' }
                });
                return res.json(updatedBooking);
            }
            return res.status(400).json({ message: 'Ya tienes una reserva activa para esta clase' });
        }

        // Create booking
        const booking = await prisma.classBooking.create({
            data: {
                classId,
                patientId: patient.id,
                status: 'BOOKED'
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Error booking class:', error);
        res.status(500).json({ message: 'Error al reservar la clase' });
    }
};

// PUT /api/training-classes/:id/confirm
// Confirm attendance to a booked class
const confirmAttendance = async (req, res) => {
    try {
        const classId = req.params.id;
        const userId = req.user.id;

        // Find patient profile
        const patient = await prisma.patient.findUnique({
            where: { userId }
        });

        if (!patient) {
            return res.status(404).json({ message: 'Perfil de paciente no encontrado' });
        }

        // Find booking
        const booking = await prisma.classBooking.findUnique({
            where: {
                classId_patientId: {
                    classId,
                    patientId: patient.id
                }
            }
        });

        if (!booking) {
            return res.status(404).json({ message: 'No tienes una reserva para esta clase' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ message: 'Tu reserva está cancelada' });
        }

        // Update to CONFIRMED
        const updatedBooking = await prisma.classBooking.update({
            where: { id: booking.id },
            data: { status: 'CONFIRMED' }
        });

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error confirming attendance:', error);
        res.status(500).json({ message: 'Error al confirmar la asistencia' });
    }
};

module.exports = {
    getUpcomingClasses,
    getMyClasses,
    bookClass,
    confirmAttendance
};
