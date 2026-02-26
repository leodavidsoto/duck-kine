const router = require('express').Router();
const prisma = require('../config/database');

// GET /api/professionals — lista pública de kinesiólogos activos
router.get('/', async (req, res, next) => {
    try {
        const professionals = await prisma.professional.findMany({
            where: { isAvailable: true },
            include: {
                user: {
                    select: { firstName: true, lastName: true, avatarUrl: true },
                },
            },
            orderBy: { user: { firstName: 'asc' } },
        });

        res.json({
            professionals: professionals.map((p) => ({
                id: p.id,
                firstName: p.user.firstName,
                lastName: p.user.lastName,
                avatarUrl: p.user.avatarUrl,
                specialty: p.specialty,
                title: p.title,
            })),
        });
    } catch (error) { next(error); }
});

module.exports = router;
