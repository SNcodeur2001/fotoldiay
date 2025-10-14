// src/modules/index.routes.ts
import { Router } from "express";
import buildUtilisateurRoute from "./utilisateur/utilisateur.route.js";
import authRouter from "./utilisateur/auth/auth.route.js";
import buildProductRoute from "./product/product.route.js";
import buildCategoryRoute from "./category/category.route.js";
import buildNotificationRoute from "./notification/notification.route.js";
import { UserController } from "./utilisateur/utilisateur.controller.js";
import { ProductController } from "./product/product.controller.js";
import { CategoryController } from "./category/category.controller.js";
import { NotificationController } from "./notification/notification.controller.js";
import PrismaService from "./abstract/PrismaService.js";
import prisma from "../prismaClient.js";
const router = Router();
// Instanciation des services avec les delegates Prisma appropriés
const userService = new PrismaService(prisma.user, "user");
const productService = new PrismaService(prisma.product, "product");
const categoryService = new PrismaService(prisma.category, "category");
// Instanciation des contrôleurs
const userController = new UserController(userService);
const productController = new ProductController(productService);
const categoryController = new CategoryController(categoryService);
const notificationController = new NotificationController();
// Configuration des routes pour chaque module
router.use("/users", buildUtilisateurRoute(userController));
router.use("/auth", authRouter);
router.use("/products", buildProductRoute(productController));
router.use("/categories", buildCategoryRoute(categoryController));
router.use("/notifications", buildNotificationRoute(notificationController));
export default router;
