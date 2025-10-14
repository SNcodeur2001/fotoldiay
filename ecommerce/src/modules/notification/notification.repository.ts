import { Notification } from "@prisma/client";
import { IPrismaService } from "../abstract/IPrismaService.js";
import prisma from "../../prismaClient.js";

export class NotificationRepository implements IPrismaService<Notification, Omit<Notification, "id" | "createdAt" | "updatedAt">, Partial<Omit<Notification, "id" | "createdAt" | "updatedAt">>> {
  async create(data: Omit<Notification, "id" | "createdAt" | "updatedAt">): Promise<Notification> {
    return await prisma.notification.create({ data });
  }

  async findMany(options?: any): Promise<Notification[]> {
    return await prisma.notification.findMany(options);
  }

  async findUnique(where: any): Promise<Notification | null> {
    return await prisma.notification.findUnique(where);
  }

  async findFirst(where: any): Promise<Notification | null> {
    return await prisma.notification.findFirst(where);
  }

  async update(where: any, data: Partial<Omit<Notification, "id" | "createdAt" | "updatedAt">>): Promise<Notification> {
    return await prisma.notification.update({ where, data });
  }

  async delete(where: any): Promise<Notification> {
    return await prisma.notification.delete(where);
  }

  async upsert(where: any, update: Partial<Omit<Notification, "id" | "createdAt" | "updatedAt">>, create: Omit<Notification, "id" | "createdAt" | "updatedAt">): Promise<Notification> {
    return await prisma.notification.upsert({ where, update, create });
  }

  async count(where?: any): Promise<number> {
    return await prisma.notification.count(where);
  }

  // Méthodes spécifiques aux notifications
  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return result.count;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  async deleteOldNotifications(daysOld: number = 30): Promise<number> {
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
