const router = require('express').Router();
const prisma = require('../config/database');

// GET /api/services — lista pública de servicios disponibles
router.get('/', async (req, res, next) => {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                description: true,
                durationMinutes: true,
                basePrice: true,
                category: true,
            },
        });

        res.json({ services });
    } catch (error) { next(error); }
});

module.exports = router;
