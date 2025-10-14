import { BaseController } from "../abstract/BaseController.js";
import { NotificationMessages } from "./notification.enum.js";
import { z } from "zod";
const NotificationBaseSchema = {
    userId: z.string().uuid(),
    title: z.string().min(1, "Le titre est requis"),
    message: z.string().min(1, "Le message est requis"),
    type: z.string().optional(),
};
export class NotificationController extends BaseController {
    service;
    createSchema = z.object(NotificationBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
        isRead: z.boolean().optional(),
    });
    constructor(service) {
        super();
        this.service = service;
    }
    getCreationMessage() {
        return NotificationMessages.CREATION_SUCCESS;
    }
    getListMessage() {
        return NotificationMessages.LIST_SUCCESS;
    }
    getDetailMessage() {
        return NotificationMessages.DETAIL_SUCCESS;
    }
    getUpdateMessage() {
        return NotificationMessages.UPDATE_SUCCESS;
    }
    getDeleteMessage() {
        return NotificationMessages.DELETE_SUCCESS;
    }
    getNotFoundMessage() {
        return NotificationMessages.NOT_FOUND;
    }
    formatEntity(entity) {
        return entity;
    }
    formatEntities(entities) {
        return entities;
    }
    // Override getAll pour les notifications utilisateur
    getAll = async (req, res, next) => {
        try {
            const userId = req.params.userId || req.user?.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await this.service.getUserNotifications(userId, { page, limit });
            res.status(200).json({
                page,
                limit,
                total: result.total,
                data: this.formatEntities(result.data),
                message: NotificationMessages.LIST_SUCCESS,
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Méthodes spécifiques aux notifications
    markAsRead = async (req, res, next) => {
        try {
            const { id } = req.params;
            const notification = await this.service.markAsRead(id);
            res.status(200).json({
                data: this.formatEntity(notification),
                message: NotificationMessages.UPDATE_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    };
    markAllAsRead = async (req, res, next) => {
        try {
            const userId = req.params.userId || req.user?.id;
            const updatedCount = await this.service.markAllAsRead(userId);
            res.status(200).json({
                data: { updatedCount },
                message: `${updatedCount} notifications marquées comme lues`
            });
        }
        catch (err) {
            next(err);
        }
    };
    getUnreadCount = async (req, res, next) => {
        try {
            const userId = req.params.userId || req.user?.id;
            const count = await this.service.getUnreadCount(userId);
            res.status(200).json({
                data: { count },
                message: NotificationMessages.COUNT_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    };
    deleteNotification = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            res.status(204).json({ message: NotificationMessages.DELETE_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
}
