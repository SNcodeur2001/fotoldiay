import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { ProductService } from "./product.service.js";
import { ProductRepository } from "./product.repository.js";
import { authenticateToken, optionalAuthenticateToken } from "../utilisateur/auth/auth.route.js";

const router = Router();

// Instanciation des dépendances
const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

// Middleware de validation pour les prix
const validatePriceMiddleware = async (req: any, res: any, next: any) => {
  if (req.body && req.body.price) {
    const price = parseFloat(req.body.price);
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ error: "Le prix doit être un nombre positif" });
    }
    req.body.price = price;
  }
  next();
};

// Routes CRUD de base
// POST requires authentication for creating products
router.post(
  "/",
  authenticateToken,
  validatePriceMiddleware,
  controller.create.bind(controller)
);
router.get("/", optionalAuthenticateToken, controller.getAll.bind(controller));
router.get("/:id", optionalAuthenticateToken, controller.getOne.bind(controller));
router.put(
  "/:id",
  authenticateToken,
  validatePriceMiddleware,
  controller.update.bind(controller)
);
router.delete("/:id", authenticateToken, controller.delete.bind(controller));

// Routes spécifiques aux vendeurs
router.get("/user/:userId", controller.getMyProducts.bind(controller));

// Middleware pour vérifier le rôle GESTIONNAIRE
const requireManager = async (req: any, res: any, next: any) => {
  try {
    console.log("req.user:", req.user); // Debug log
    console.log("req.user.role:", req.user?.role); // Debug log
    // Vérifier si l'utilisateur est authentifié et a le rôle GESTIONNAIRE
    if (!req.user || req.user.role !== "GESTIONNAIRE") {
      console.log("Access denied: user role is", req.user?.role); // Debug log
      return res
        .status(403)
        .json({ error: "Accès refusé. Rôle GESTIONNAIRE requis." });
    }
    next();
  } catch (error) {
    console.error("Error in requireManager middleware:", error); // Debug log
    res
      .status(500)
      .json({ error: "Erreur lors de la vérification des permissions" });
  }
};

// Routes de modération (nécessitent des droits spécifiques)
router.put(
  "/:id/approve",
  authenticateToken,
  requireManager,
  controller.approveProduct.bind(controller)
);
router.put(
  "/:id/reject",
  authenticateToken,
  requireManager,
  controller.rejectProduct.bind(controller)
);
router.put(
  "/:id/vip",
  authenticateToken,
  requireManager,
  controller.setVipStatus.bind(controller)
);

export default router;
