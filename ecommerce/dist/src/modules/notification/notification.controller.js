import prisma from "../../prismaClient.js";
import { NotificationMessages } from "./notification.enum.js";
export class NotificationController {
    // Get user notifications
    async getUserNotifications(req, res, next) {
        try {
            const userId = req.params.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [notifications, totalCount] = await Promise.all([
                prisma.notification.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.notification.count({ where: { userId } })
            ]);
            res.status(200).json({
                page,
                limit,
                count: totalCount,
                data: notifications,
                message: NotificationMessages.LIST_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Mark notification as read
    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await prisma.notification.update({
                where: { id },
                data: { isRead: true }
            });
            if (!notification) {
                return res.status(404).json({ error: NotificationMessages.NOT_FOUND });
            }
            res.status(200).json({
                data: notification,
                message: NotificationMessages.UPDATE_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Mark all user notifications as read
    async markAllAsRead(req, res, next) {
        try {
            const userId = req.params.userId;
            const result = await prisma.notification.updateMany({
                where: { userId, isRead: false },
                data: { isRead: true }
            });
            res.status(200).json({
                data: { updatedCount: result.count },
                message: `${result.count} notifications marquées comme lues`
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Get unread count
    async getUnreadCount(req, res, next) {
        try {
            const userId = req.params.userId;
            const count = await prisma.notification.count({
                where: { userId, isRead: false }
            });
            res.status(200).json({
                data: { count },
                message: NotificationMessages.COUNT_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Delete notification
    async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.notification.delete({
                where: { id }
            });
            res.status(204).json({ message: NotificationMessages.DELETE_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    }
}
