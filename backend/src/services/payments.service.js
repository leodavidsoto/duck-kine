const prisma = require('../config/database');

class PaymentsService {
    async initPayment({ patientId, appointmentId, amount, method }) {
        const payment = await prisma.payment.create({
            data: { patientId, appointmentId, amount, method, status: 'PENDING' },
        });

        if (method === 'WEBPAY') {
            // TODO: Integrate Transbank SDK
            // const response = await transbank.createTransaction(...)
            return {
                payment,
                webpay: {
                    url: 'https://webpay3gint.transbank.cl/webpayserver/initTransaction',
                    token: `mock-token-${payment.id}`,
                },
            };
        }

        return { payment };
    }

    async confirmPayment(paymentId, transactionData) {
        return prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'APPROVED',
                transactionId: transactionData.transactionId || null,
                metadata: transactionData,
            },
        });
    }

    async getMyPayments(patientId, { page = 1, limit = 20 }) {
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where: { patientId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    appointment: { include: { service: true } },
                },
            }),
            prisma.payment.count({ where: { patientId } }),
        ]);

        return { payments, total, page, totalPages: Math.ceil(total / limit) };
    }

    async getReceipt(paymentId) {
        return prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                patient: { include: { user: { select: { firstName: true, lastName: true, rut: true, email: true } } } },
                appointment: { include: { service: true, professional: { include: { user: { select: { firstName: true, lastName: true } } } } } },
            },
        });
    }
}

module.exports = new PaymentsService();
