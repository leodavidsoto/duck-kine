require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../src/config/database');

async function seed() {
    console.log('🌱 Seeding Duck Kinesiología...\n');

    // ─── 1. Professional user ────────────────────────────
    const profEmail = 'kine@duckkine.cl';
    const existing = await prisma.user.findUnique({ where: { email: profEmail } });

    let profUser;

    // Check by RUT as well to avoid unique constraint if email was changed
    const existingByRut = await prisma.user.findUnique({ where: { rut: '12.345.678-9' } });

    if (existing) {
        console.log(`✅ Professional user already exists: ${profEmail}`);
        profUser = existing;
    } else if (existingByRut) {
        console.log(`✅ Professional user already exists by RUT: 12.345.678-9`);
        profUser = existingByRut;
    } else {
        const hash = await bcrypt.hash('duckkine2026', 12);
        profUser = await prisma.user.create({
            data: {
                email: profEmail,
                passwordHash: hash,
                firstName: 'Carlos',
                lastName: 'Muñoz',
                rut: '12.345.678-9',
                phone: '+56912345678',
                role: 'PROFESSIONAL',
                professional: {
                    create: {
                        specialty: 'Kinesiología Deportiva',
                        licenseNumber: 'SIS-1234',
                        university: 'Universidad de Chile',
                        yearsExperience: 8,
                        bio: 'Kinesiólogo deportivo con 8 años de experiencia en rehabilitación y rendimiento deportivo.',
                        isAvailable: true,
                        colorTag: '#0891b2',
                    },
                },
            },
            include: { professional: true },
        });
        console.log(`✅ Created professional: ${profUser.firstName} ${profUser.lastName} (${profEmail})`);
    }

    // ─── 2. Schedule for the professional ────────────────
    const professional = await prisma.professional.findUnique({ where: { userId: profUser.id } });

    if (professional) {
        const existingSchedule = await prisma.schedule.findFirst({ where: { professionalId: professional.id } });
        if (!existingSchedule) {
            const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
            for (const day of days) {
                // Morning block: 8:30 - 13:30
                await prisma.schedule.create({
                    data: {
                        professionalId: professional.id,
                        dayOfWeek: day,
                        startTime: '08:30',
                        endTime: '13:30',
                        slotDuration: 50,
                        isActive: true,
                    },
                });
                // Afternoon block: 17:10 - 23:00
                await prisma.schedule.create({
                    data: {
                        professionalId: professional.id,
                        dayOfWeek: day,
                        startTime: '17:10',
                        endTime: '23:00',
                        slotDuration: 50,
                        isActive: true,
                    },
                });
            }
            console.log('✅ Created schedule (Mon-Fri 08:30-13:30 / 17:10-23:00, bloques de 50 min)');
        } else {
            console.log('✅ Schedule already exists');
        }
    }

    // ─── 3. Services catalog ─────────────────────────────
    const servicesData = [
        { name: 'Sesion de Kinesiologia', description: 'Rehabilitacion deportiva, terapia manual, educacion postural y fisioterapia', durationMinutes: 50, price: 20000, category: 'Kinesiología', isActive: true },
        { name: 'Pack 10 Sesiones Kinesiologia', description: 'Pack de 10 sesiones de kinesiologia con evaluacion incluida', durationMinutes: 50, price: 200000, category: 'Kinesiología', isActive: true, maxSessionsPackage: 10 },
        { name: 'Sesion Preventiva', description: 'Masoterapia, crioterapia, presoterapia y electroterapia preventiva', durationMinutes: 50, price: 24000, category: 'Preventiva', isActive: true },
        { name: 'Masoterapia', description: 'Masaje de relajacion, descontracturante y drenaje linfatico', durationMinutes: 50, price: 24000, category: 'Masoterapia', isActive: true },
        { name: 'Entrenamiento Fisico', description: 'Fuerza, funcional, HIIT y GAP', durationMinutes: 50, price: 33600, category: 'Entrenamiento', isActive: true },
        { name: 'Entrenamiento de Futbol', description: 'Fuerza, agilidad y reaccion para futbolistas', durationMinutes: 50, price: 33600, category: 'Entrenamiento', isActive: true },
    ];

    for (const svc of servicesData) {
        const exists = await prisma.service.findFirst({ where: { name: svc.name } });
        if (!exists) {
            await prisma.service.create({ data: svc });
            console.log(`✅ Created service: ${svc.name}`);
        }
    }

    console.log('\n🦆 Seed complete!');
    console.log(`\n📋 Login credentials:`);
    console.log(`   Professional: ${profEmail} / duckkine2026`);
    console.log(`   → Will redirect to /admin\n`);

    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error('❌ Seed error:', e);
    prisma.$disconnect();
    process.exit(1);
});
