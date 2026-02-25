require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./src/config/database');

async function seed() {
    console.log('🌱 Seeding Duck Kinesiología...\n');

    // ─── 1. Professional user ────────────────────────────
    const profEmail = 'kine@duckkine.cl';
    const existing = await prisma.user.findUnique({ where: { email: profEmail } });

    let profUser;
    if (existing) {
        console.log(`✅ Professional user already exists: ${profEmail}`);
        profUser = existing;
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
                await prisma.schedule.create({
                    data: {
                        professionalId: professional.id,
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
            console.log('✅ Created schedule (Mon-Fri 09:00-18:00)');
        } else {
            console.log('✅ Schedule already exists');
        }
    }

    // ─── 3. Services catalog ─────────────────────────────
    const servicesData = [
        { name: 'Evaluación Kinésica', description: 'Evaluación física completa con diagnóstico kinésico', durationMinutes: 60, price: 45000, category: 'Evaluación', isActive: true },
        { name: 'Sesión de Kinesiología', description: 'Sesión de tratamiento kinesiológico', durationMinutes: 45, price: 35000, category: 'Kinesiología', isActive: true },
        { name: 'Kinesiología Deportiva', description: 'Rehabilitación y rendimiento deportivo', durationMinutes: 60, price: 50000, category: 'Deportiva', isActive: true },
        { name: 'Terapia Manual', description: 'Técnicas manuales de movilización articular y tejido blando', durationMinutes: 45, price: 40000, category: 'Terapia Manual', isActive: true },
        { name: 'Reeducación Postural', description: 'Corrección postural y ejercicio terapéutico', durationMinutes: 45, price: 38000, category: 'Postural', isActive: true },
        { name: 'Control de Seguimiento', description: 'Control breve post-tratamiento', durationMinutes: 30, price: 25000, category: 'Control', isActive: true },
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
