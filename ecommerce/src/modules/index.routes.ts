// src/modules/index.routes.ts

import { Router } from "express";
import productRoute from "./product/product.route.js";
import notificationRoute from "./notification/notification.route.js";
import buildUtilisateurRoute from "./utilisateur/utilisateur.route.js";
import categoryRoute from "./category/category.route.js";
import authRoute, { authenticateToken } from "./utilisateur/auth/auth.route.js";
import { UserController } from "./utilisateur/utilisateur.controller.js";
import { PrismaService } from "./abstract/PrismaService.js";
import { User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto } from "./utilisateur/utilisateur.dto.js";

const router = Router();

// Instanciation des contrôleurs
const userController = new UserController(new PrismaService<User, CreateUserDto, UpdateUserDto>('user'));

// Configuration des routes pour chaque module
// Products route accessible without authentication for visitors
router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/notifications", authenticateToken, notificationRoute);
router.use("/auth", authRoute);
router.use("/users", authenticateToken, buildUtilisateurRoute(userController));

export default router;
