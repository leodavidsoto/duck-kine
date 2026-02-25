const prisma = require('../config/database');

class CorporateService {
    async submitContactForm({ companyName, rut, contactName, contactEmail, contactPhone, employeeCount }) {
        return prisma.corporateClient.create({
            data: { companyName, rut, contactName, contactEmail, contactPhone, employeeCount },
        });
    }

    async getPlans() {
        // Return pre-defined corporate plans
        return [
            {
                name: 'Plan Básico',
                sessionsPerMonth: 10,
                monthlyPrice: 350000,
                features: ['10 sesiones/mes', 'Evaluación inicial', 'Reportes mensuales'],
            },
            {
                name: 'Plan Profesional',
                sessionsPerMonth: 30,
                monthlyPrice: 900000,
                features: ['30 sesiones/mes', 'Evaluación integral', 'Pausas activas', 'Reportes detallados'],
            },
            {
                name: 'Plan Enterprise',
                sessionsPerMonth: 0, // unlimited
                monthlyPrice: 0, // custom pricing
                features: ['Sesiones ilimitadas', 'Kinesiólogo dedicado', 'Programas especiales', 'Precio personalizado'],
            },
        ];
    }

    async subscribe(clientId, planData) {
        return prisma.corporatePlan.create({
            data: {
                clientId,
                planName: planData.planName,
                sessionsPerMonth: planData.sessionsPerMonth,
                monthlyPrice: planData.monthlyPrice,
                startDate: new Date(),
            },
            include: { client: true },
        });
    }
}

module.exports = new CorporateService();
