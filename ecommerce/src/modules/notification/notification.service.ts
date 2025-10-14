import { Notification } from "@prisma/client";
import { NotificationRepository } from "./notification.repository.js";
import { NotificationMessages } from "./notification.enum.js";

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  type?: string;
}

export interface UpdateNotificationDto {
  isRead?: boolean;
}

export class NotificationService {
  constructor(private repository: NotificationRepository) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    const notificationData = {
      ...data,
      isRead: false,
      type: (data.type as any) || 'INFO'
    };

    return await this.repository.create(notificationData);
  }

  async findAll(options?: {
    userId?: string;
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<{ data: Notification[]; total: number; page: number; limit: number }> {
    const { userId, page = 1, limit = 10, isRead } = options || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (isRead !== undefined) where.isRead = isRead;

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

  async findById(id: string): Promise<Notification | null> {
    return await this.repository.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateNotificationDto): Promise<Notification> {
    return await this.repository.update({ id }, data);
  }

  async delete(id: string): Promise<Notification> {
    const existingNotification = await this.findById(id);
    if (!existingNotification) {
      throw new Error(NotificationMessages.NOT_FOUND);
    }

    return await this.repository.delete({ where: { id } });
  }

  // Méthodes spécifiques aux notifications utilisateur
  async getUserNotifications(userId: string, options?: { page?: number; limit?: number }): Promise<{ data: Notification[]; total: number }> {
    const result = await this.findAll({ userId, ...options });
    return { data: result.data, total: result.total };
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.repository.update({ id }, { isRead: true });
    return notification;
  }

  async markAllAsRead(userId: string): Promise<number> {
    return await this.repository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.repository.getUnreadCount(userId);
  }

  // Méthodes utilitaires
  async createSystemNotification(userId: string, title: string, message: string): Promise<Notification> {
    return await this.create({
      userId,
      title,
      message,
      type: 'WARNING'
    });
  }

  async createProductNotification(userId: string, title: string, message: string): Promise<Notification> {
    return await this.create({
      userId,
      title,
      message,
      type: 'SUCCESS'
    });
  }

  async cleanupOldNotifications(): Promise<number> {
    return await this.repository.deleteOldNotifications();
  }
}
