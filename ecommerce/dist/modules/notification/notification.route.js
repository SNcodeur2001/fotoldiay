import { Router } from "express";
import { NotificationController } from "./notification.controller.js";
import { NotificationService } from "./notification.service.js";
import { NotificationRepository } from "./notification.repository.js";
const router = Router();
// Instanciation des dépendances
const repository = new NotificationRepository();
const service = new NotificationService(repository);
const controller = new NotificationController(service);
// Routes CRUD de base
router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getOne.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.deleteNotification.bind(controller));
// Routes spécifiques aux notifications utilisateur
router.get("/user/:userId", controller.getAll.bind(controller));
router.put("/:id/read", controller.markAsRead.bind(controller));
router.put("/user/:userId/read-all", controller.markAllAsRead.bind(controller));
router.get("/user/:userId/unread-count", controller.getUnreadCount.bind(controller));
export default router;
