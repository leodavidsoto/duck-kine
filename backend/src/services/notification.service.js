const prisma = require('../config/database');

class NotificationService {
    async create({ userId, title, message, type = 'SYSTEM' }) {
        return prisma.notification.create({
            data: { userId, title, message, type },
        });
    }

    async getByUser(userId, { page = 1, limit = 20, unreadOnly = false }) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (unreadOnly) where.isRead = false;

        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma.notification.count({ where }),
            prisma.notification.count({ where: { userId, isRead: false } }),
        ]);

        return { notifications, total, unreadCount, page, totalPages: Math.ceil(total / limit) };
    }

    async markAsRead(id) {
        return prisma.notification.update({ where: { id }, data: { isRead: true } });
    }

    async markAllAsRead(userId) {
        return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    }
}

module.exports = new NotificationService();
