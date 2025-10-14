import { NotificationMessages } from "./notification.enum.js";
export class NotificationService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        const notificationData = {
            ...data,
            isRead: false,
            type: data.type || 'INFO'
        };
        return await this.repository.create(notificationData);
    }
    async findAll(options) {
        const { userId, page = 1, limit = 10, isRead } = options || {};
        const skip = (page - 1) * limit;
        const where = {};
        if (userId)
            where.userId = userId;
        if (isRead !== undefined)
            where.isRead = isRead;
        const [data, total] = await Promise.all([
            this.repository.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            this.repository.count({ where })
        ]);
        return { data, total, page, limit };
    }
    async findById(id) {
        return await this.repository.findUnique({ where: { id } });
    }
    async update(id, data) {
        return await this.repository.update({ id }, data);
    }
    async delete(id) {
        const existingNotification = await this.findById(id);
        if (!existingNotification) {
            throw new Error(NotificationMessages.NOT_FOUND);
        }
        return await this.repository.delete({ where: { id } });
    }
    // Méthodes spécifiques aux notifications utilisateur
    async getUserNotifications(userId, options) {
        const result = await this.findAll({ userId, ...options });
        return { data: result.data, total: result.total };
    }
    async markAsRead(id) {
        const notification = await this.repository.update({ id }, { isRead: true });
        return notification;
    }
    async markAllAsRead(userId) {
        return await this.repository.markAllAsRead(userId);
    }
    async getUnreadCount(userId) {
        return await this.repository.getUnreadCount(userId);
    }
    // Méthodes utilitaires
    async createSystemNotification(userId, title, message) {
        return await this.create({
            userId,
            title,
            message,
            type: 'WARNING'
        });
    }
    async createProductNotification(userId, title, message) {
        return await this.create({
            userId,
            title,
            message,
            type: 'SUCCESS'
        });
    }
    async cleanupOldNotifications() {
        return await this.repository.deleteOldNotifications();
    }
}
