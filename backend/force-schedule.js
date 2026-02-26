const prisma = require('./src/config/database');

async function attachProfessionalData() {
    console.log('Attaching Professional and Schedule data...');
    try {
        const user = await prisma.user.findFirst({ where: { role: 'PROFESSIONAL' } });
        if (!user) {
            console.log('No professional user found, please run seed first.');
            return;
        }

        let prof = await prisma.professional.findUnique({ where: { userId: user.id } });
        if (!prof) {
            prof = await prisma.professional.create({
                data: {
                    userId: user.id,
                    specialty: 'Kinesiología Deportiva',
                    licenseNumber: 'SIS-1234',
                    yearsExperience: 8,
                    isAvailable: true,
                }
            });
            console.log('Created Professional profile.');
        } else {
            console.log('Professional profile already exists.');
        }

        const existingSchedules = await prisma.schedule.count({ where: { professionalId: prof.id } });
        if (existingSchedules === 0) {
            const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
            for (const day of days) {
                await prisma.schedule.create({
                    data: {
                        professionalId: prof.id,
                        dayOfWeek: day,
                        startTime: '09:00',
                        endTime: '18:00',
                        breakStart: '13:00',
                        breakEnd: '14:00',
                        slotDuration: 30,
                        isActive: true,
                    },
                });
            }
            console.log('Created Schedules for all weekdays.');
        } else {
            console.log('Schedules already exist.');
        }
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

attachProfessionalData();
