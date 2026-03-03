require('dotenv').config();
const prisma = require('./src/config/database');

async function main() {
    try {
        // Find a professional to be the trainer
        const professional = await prisma.professional.findFirst();
        if (!professional) {
            console.log('No professional found to act as trainer');
            return;
        }

        // Add actual upcoming classes based on real schedules
        // Físico, Fútbol, Boxeo
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(now);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

        // Class 1: Físico Lunes/Miercoles/Viernes
        await prisma.trainingClass.create({
            data: {
                title: 'Entrenamiento Físico',
                description: 'Acondicionamiento físico general con énfasis en fuerza y resistencia.',
                startTime: new Date(tomorrow.setHours(9, 0, 0, 0)),
                endTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
                capacity: 15,
                trainer: { connect: { id: professional.id } },
            }
        });

        // Class 2: Físico tarde
        await prisma.trainingClass.create({
            data: {
                title: 'Entrenamiento Físico',
                description: 'Acondicionamiento físico general. ¡Ven con energía!',
                startTime: new Date(tomorrow.setHours(19, 0, 0, 0)),
                endTime: new Date(tomorrow.setHours(20, 0, 0, 0)),
                capacity: 15,
                trainer: { connect: { id: professional.id } },
            }
        });

        // Class 3: Fútbol
        await prisma.trainingClass.create({
            data: {
                title: 'Entrenamiento de Fútbol',
                description: 'Mejora tu técnica, táctica y estado físico orientado al fútbol competitivo y recreativo.',
                startTime: new Date(tomorrow.setHours(20, 0, 0, 0)),
                endTime: new Date(tomorrow.setHours(21, 0, 0, 0)),
                capacity: 22, // Two teams of 11
                trainer: { connect: { id: professional.id } },
            }
        });

        // Class 4: Boxeo Martes/Jueves
        await prisma.trainingClass.create({
            data: {
                title: 'Boxeo',
                description: 'Trabajo cardiovascular, sacos, manoplas y técnica de boxeo.',
                startTime: new Date(dayAfterTomorrow.setHours(21, 0, 0, 0)),
                endTime: new Date(dayAfterTomorrow.setHours(22, 0, 0, 0)),
                capacity: 10,
                trainer: { connect: { id: professional.id } },
            }
        });

        // Class 5: Físico tarde noche
        await prisma.trainingClass.create({
            data: {
                title: 'Entrenamiento Físico (Nocturno)',
                description: 'Último turno del día para liberar el estrés con un acondicionamiento full body.',
                startTime: new Date(tomorrow.setHours(21, 0, 0, 0)),
                endTime: new Date(tomorrow.setHours(22, 0, 0, 0)),
                capacity: 15,
                trainer: { connect: { id: professional.id } },
            }
        });

        console.log('Real schedule test classes inserted successfully!');
    } catch (err) {
        console.error('Error inserting classes:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
