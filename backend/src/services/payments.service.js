const prisma = require('../config/database');
const { WebpayPlus } = require('transbank-sdk');
const env = require('../config/env');

class PaymentsService {
    async initPayment({ patientId, appointmentId, amount, method }) {
        const payment = await prisma.payment.create({
            data: { patientId, appointmentId, amount, method, status: 'PENDING' },
        });

        if (method === 'WEBPAY') {
            const buyOrder = `order-${payment.id}`;
            const sessionId = `session-${patientId}`;
            const returnUrl = `${env.BACKEND_URL}/payments/confirm`;

            const createResponse = await WebpayPlus.Transaction.create(
                buyOrder,
                sessionId,
                Math.round(amount),
                returnUrl
            );

            return {
                payment,
                webpay: {
                    url: createResponse.url,
                    token: createResponse.token,
                },
            };
        }

        return { payment };
    }

    async confirmPayment(tokenWs) {
        if (!tokenWs) throw new Error('Token is required');

        const commitResponse = await WebpayPlus.Transaction.commit(tokenWs);

        let status = 'REJECTED';
        if (commitResponse.status === 'AUTHORIZED' && commitResponse.response_code === 0) {
            status = 'APPROVED';
        }

        const buyOrder = commitResponse.buy_order;
        const paymentId = buyOrder.replace('order-', '');

        return prisma.payment.update({
            where: { id: paymentId },
            data: {
                status,
                transactionId: commitResponse.authorization_code || null,
                metadata: commitResponse,
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
