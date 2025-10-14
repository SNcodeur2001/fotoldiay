import { Router } from "express";
export default function buildNotificationRoute(controller) {
    const router = Router();
    router.get("/users/:userId", controller.getUserNotifications.bind(controller));
    router.get("/users/:userId/unread-count", controller.getUnreadCount.bind(controller));
    router.put("/:id/read", controller.markAsRead.bind(controller));
    router.put("/users/:userId/read-all", controller.markAllAsRead.bind(controller));
    router.delete("/:id", controller.deleteNotification.bind(controller));
    return router;
}
