/**
 * Franchise & Clinic Management Service
 * ═══════════════════════════════════════════════════════
 * CRUD for organizations, clinics, franchise licenses,
 * metrics snapshots, and multi-tenant queries.
 */

const prisma = require('../config/database');

class FranchiseService {

    // ─── ORGANIZATIONS ─────────────────────────────────────

    static async createOrganization(data) {
        return prisma.organization.create({ data });
    }

    static async getOrganization(id) {
        return prisma.organization.findUnique({
            where: { id },
            include: {
                clinics: { include: { franchiseLicense: true } },
                _count: { select: { clinics: true, franchiseLicenses: true } },
            },
        });
    }

    // ─── CLINICS ───────────────────────────────────────────

    static async createClinic(data) {
        const clinic = await prisma.clinic.create({
            data,
            include: { organization: true },
        });
        return clinic;
    }

    static async getClinics(organizationId, filters = {}) {
        const where = { organizationId };
        if (filters.status) where.status = filters.status;
        if (filters.type) where.type = filters.type;
        if (filters.city) where.city = filters.city;

        return prisma.clinic.findMany({
            where,
            include: {
                _count: {
                    select: {
                        professionals: true,
                        appointments: true,
                        payments: true,
                        rooms: true,
                    },
                },
                franchiseLicense: { select: { status: true, franchiseeName: true } },
            },
            orderBy: { name: 'asc' },
        });
    }

    static async getClinicBySlug(slug) {
        return prisma.clinic.findUnique({
            where: { slug },
            include: {
                organization: true,
                rooms: { where: { isActive: true } },
                professionals: {
                    where: { isActive: true },
                    include: {
                        professional: {
                            include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
                        },
                    },
                },
                services: {
                    where: { isAvailable: true },
                    include: { service: true },
                },
            },
        });
    }

    static async updateClinic(id, data) {
        return prisma.clinic.update({ where: { id }, data });
    }

    // ─── CLINIC PROFESSIONALS ──────────────────────────────

    static async assignProfessional(clinicId, professionalId, role = 'STAFF') {
        return prisma.clinicProfessional.upsert({
            where: {
                clinicId_professionalId: { clinicId, professionalId },
            },
            create: { clinicId, professionalId, role },
            update: { role, isActive: true, endDate: null },
        });
    }

    static async removeProfessional(clinicId, professionalId) {
        return prisma.clinicProfessional.update({
            where: {
                clinicId_professionalId: { clinicId, professionalId },
            },
            data: { isActive: false, endDate: new Date() },
        });
    }

    // ─── CLINIC SERVICES ───────────────────────────────────

    static async setClinicService(clinicId, serviceId, { localPrice, isAvailable = true }) {
        return prisma.clinicService.upsert({
            where: {
                clinicId_serviceId: { clinicId, serviceId },
            },
            create: { clinicId, serviceId, localPrice, isAvailable },
            update: { localPrice, isAvailable },
        });
    }

    // ─── ROOMS ─────────────────────────────────────────────

    static async createRoom(clinicId, data) {
        return prisma.clinicRoom.create({
            data: { clinicId, ...data },
        });
    }

    static async getRooms(clinicId) {
        return prisma.clinicRoom.findMany({
            where: { clinicId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    // ─── FRANCHISE LICENSES ────────────────────────────────

    static async createLicense(data) {
        // First create the clinic as FRANQUICIA type
        const clinic = await prisma.clinic.create({
            data: {
                organizationId: data.organizationId,
                name: data.clinicName,
                slug: data.slug,
                type: 'FRANQUICIA',
                address: data.address,
                commune: data.commune,
                city: data.city,
                region: data.region,
                phone: data.franchiseePhone,
                email: data.franchiseeEmail,
            },
        });

        // Then create the franchise license
        const license = await prisma.franchiseLicense.create({
            data: {
                organizationId: data.organizationId,
                clinicId: clinic.id,
                franchiseeName: data.franchiseeName,
                franchiseeRut: data.franchiseeRut,
                franchiseeEmail: data.franchiseeEmail,
                franchiseePhone: data.franchiseePhone,
                contractStart: data.contractStart,
                contractEnd: data.contractEnd,
                monthlyFee: data.monthlyFee,
                revenueSharePct: data.revenueSharePct || 0.08,
                initialInvestment: data.initialInvestment,
                exclusiveTerritory: data.exclusiveTerritory,
                territoryRadius: data.territoryRadius,
            },
            include: { clinic: true },
        });

        return license;
    }

    static async getLicenses(organizationId) {
        return prisma.franchiseLicense.findMany({
            where: { organizationId },
            include: {
                clinic: {
                    include: {
                        _count: { select: { professionals: true, appointments: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async updateLicenseStatus(licenseId, status) {
        const license = await prisma.franchiseLicense.update({
            where: { id: licenseId },
            data: { status },
        });

        // If suspended or terminated, also update the clinic
        if (['LICENSE_SUSPENDED', 'LICENSE_TERMINATED'].includes(status)) {
            await prisma.clinic.update({
                where: { id: license.clinicId },
                data: { status: status === 'LICENSE_SUSPENDED' ? 'SUSPENDED' : 'CLOSED' },
            });
        }

        return license;
    }

    // ─── FRANCHISE PAYMENTS ────────────────────────────────

    static async calculateMonthlyPayment(licenseId, period) {
        const license = await prisma.franchiseLicense.findUnique({
            where: { id: licenseId },
        });

        if (!license) throw new Error('Licencia no encontrada');

        // Calculate revenue for the period
        const [year, month] = period.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const revenueResult = await prisma.payment.aggregate({
            where: {
                clinicId: license.clinicId,
                status: 'APPROVED',
                paidAt: { gte: startDate, lte: endDate },
            },
            _sum: { totalAmount: true },
        });

        const revenueBase = Number(revenueResult._sum.totalAmount || 0);
        const revenueShare = Math.round(revenueBase * license.revenueSharePct);
        const totalDue = license.monthlyFee + revenueShare;

        return prisma.franchisePayment.upsert({
            where: { licenseId_period: { licenseId, period } },
            create: {
                licenseId,
                period,
                fixedFee: license.monthlyFee,
                revenueBase,
                revenueShare,
                totalDue,
            },
            update: { revenueBase, revenueShare, totalDue },
        });
    }

    // ─── METRICS SNAPSHOTS ─────────────────────────────────

    static async generateMetricsSnapshot(clinicId, period) {
        const [year, month] = period.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const [patients, newPatients, appointments, sessions, noShows, revenue] = await Promise.all([
            prisma.appointment.findMany({
                where: { clinicId, startTime: { gte: startDate, lte: endDate } },
                select: { patientId: true },
                distinct: ['patientId'],
            }),
            prisma.patient.count({
                where: { createdAt: { gte: startDate, lte: endDate } },
            }),
            prisma.appointment.count({
                where: { clinicId, startTime: { gte: startDate, lte: endDate } },
            }),
            prisma.session.count({
                where: { clinicId, status: 'COMPLETED', createdAt: { gte: startDate, lte: endDate } },
            }),
            prisma.appointment.count({
                where: { clinicId, status: 'NO_SHOW', startTime: { gte: startDate, lte: endDate } },
            }),
            prisma.payment.aggregate({
                where: { clinicId, status: 'APPROVED', paidAt: { gte: startDate, lte: endDate } },
                _sum: { totalAmount: true },
            }),
        ]);

        const noShowRate = appointments > 0 ? noShows / appointments : 0;

        return prisma.clinicMetricsSnapshot.upsert({
            where: { clinicId_period: { clinicId, period } },
            create: {
                clinicId,
                period,
                totalPatients: patients.length,
                newPatients,
                totalAppointments: appointments,
                completedSessions: sessions,
                noShowRate: Math.round(noShowRate * 100) / 100,
                totalRevenue: Number(revenue._sum.totalAmount || 0),
            },
            update: {
                totalPatients: patients.length,
                newPatients,
                totalAppointments: appointments,
                completedSessions: sessions,
                noShowRate: Math.round(noShowRate * 100) / 100,
                totalRevenue: Number(revenue._sum.totalAmount || 0),
            },
        });
    }

    // ─── NETWORK DASHBOARD ─────────────────────────────────

    static async getNetworkOverview(organizationId) {
        const clinics = await prisma.clinic.findMany({
            where: { organizationId },
            select: { id: true, name: true, type: true, status: true, slug: true },
        });

        const clinicIds = clinics.map(c => c.id);
        const currentPeriod = new Date().toISOString().slice(0, 7); // "2026-02"

        const [metrics, activeLicenses, totalRevenue] = await Promise.all([
            prisma.clinicMetricsSnapshot.findMany({
                where: { clinicId: { in: clinicIds }, period: currentPeriod },
            }),
            prisma.franchiseLicense.count({
                where: { organizationId, status: 'LICENSE_ACTIVE' },
            }),
            prisma.payment.aggregate({
                where: {
                    clinicId: { in: clinicIds },
                    status: 'APPROVED',
                    paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
                },
                _sum: { totalAmount: true },
            }),
        ]);

        return {
            totalClinics: clinics.length,
            activeClinics: clinics.filter(c => c.status === 'ACTIVE').length,
            propias: clinics.filter(c => c.type === 'PROPIA').length,
            franquicias: clinics.filter(c => c.type === 'FRANQUICIA').length,
            activeLicenses,
            monthlyRevenue: Number(totalRevenue._sum.totalAmount || 0),
            clinics,
            metrics,
        };
    }
}

module.exports = FranchiseService;
