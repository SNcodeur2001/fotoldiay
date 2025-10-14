import prisma from "../../prismaClient.js";
export class NotificationRepository {
    async create(data) {
        return await prisma.notification.create({ data });
    }
    async findMany(options) {
        return await prisma.notification.findMany(options);
    }
    async findUnique(where) {
        return await prisma.notification.findUnique(where);
    }
    async findFirst(where) {
        return await prisma.notification.findFirst(where);
    }
    async update(where, data) {
        return await prisma.notification.update({ where, data });
    }
    async delete(where) {
        return await prisma.notification.delete(where);
    }
    async upsert(where, update, create) {
        return await prisma.notification.upsert({ where, update, create });
    }
    async count(where) {
        return await prisma.notification.count(where);
    }
    // Méthodes spécifiques aux notifications
    async markAllAsRead(userId) {
        const result = await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        return result.count;
    }
    async getUnreadCount(userId) {
        return await prisma.notification.count({
            where: { userId, isRead: false }
        });
    }
    async deleteOldNotifications(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const result = await prisma.notification.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffDate
                }
            }
        });
        return result.count;
    }
}
