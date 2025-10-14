import { Notification } from "@prisma/client";
import { BaseController } from "../abstract/BaseController.js";
import { NotificationService, CreateNotificationDto, UpdateNotificationDto } from "./notification.service.js";
import { NotificationRepository } from "./notification.repository.js";
import { NotificationMessages } from "./notification.enum.js";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const NotificationBaseSchema = {
  userId: z.string().uuid(),
  title: z.string().min(1, "Le titre est requis"),
  message: z.string().min(1, "Le message est requis"),
  type: z.string().optional(),
};

export class NotificationController extends BaseController<Notification, CreateNotificationDto, UpdateNotificationDto> {
  protected service: NotificationService;
  protected createSchema = z.object(NotificationBaseSchema) as z.ZodType<
    Omit<CreateNotificationDto, "id" | "createdAt" | "updatedAt">
  >;

  protected updateSchema = z
    .object({
      id: z.string().uuid().optional(),
      isRead: z.boolean().optional(),
    }) as z.ZodType<UpdateNotificationDto>;

  constructor(service: NotificationService) {
    super();
    this.service = service;
  }

  protected getCreationMessage(): string {
    return NotificationMessages.CREATION_SUCCESS;
  }

  protected getListMessage(): string {
    return NotificationMessages.LIST_SUCCESS;
  }

  protected getDetailMessage(): string {
    return NotificationMessages.DETAIL_SUCCESS;
  }

  protected getUpdateMessage(): string {
    return NotificationMessages.UPDATE_SUCCESS;
  }

  protected getDeleteMessage(): string {
    return NotificationMessages.DELETE_SUCCESS;
  }

  protected getNotFoundMessage(): string {
    return NotificationMessages.NOT_FOUND;
  }

  protected formatEntity(entity: Notification): any {
    return entity;
  }

  protected formatEntities(entities: Notification[]): any[] {
    return entities;
  }

  // Override getAll pour les notifications utilisateur
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId || (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.service.getUserNotifications(userId, { page, limit });

      res.status(200).json({
        page,
        limit,
        total: result.total,
        data: this.formatEntities(result.data),
        message: NotificationMessages.LIST_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };

  // Méthodes spécifiques aux notifications
  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const notification = await this.service.markAsRead(id);

      res.status(200).json({
        data: this.formatEntity(notification),
        message: NotificationMessages.UPDATE_SUCCESS
      });
    } catch (err) {
      next(err);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId || (req as any).user?.id;
      const updatedCount = await this.service.markAllAsRead(userId);

      res.status(200).json({
        data: { updatedCount },
        message: `${updatedCount} notifications marquées comme lues`
      });
    } catch (err) {
      next(err);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId || (req as any).user?.id;
      const count = await this.service.getUnreadCount(userId);

      res.status(200).json({
        data: { count },
        message: NotificationMessages.COUNT_SUCCESS
      });
    } catch (err) {
      next(err);
    }
  };

  deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      res.status(204).json({ message: NotificationMessages.DELETE_SUCCESS });
    } catch (err) {
      next(err);
    }
  };
}
