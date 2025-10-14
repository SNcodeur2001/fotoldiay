import { Router } from "express";
import { requireCategoryPermission, requireCategoryReadAccess, } from "./categoryAuthMiddleware.js";
import { validateCategoryData } from "./validateCategory.js";
const router = Router();
// Routes d'authentification spécifiques aux catégories
// Ces routes peuvent être utilisées pour des actions spéciales sur les catégories
// Route pour valider les permissions avant création/modification/suppression
router.use("/manage", requireCategoryPermission);
// Route pour valider l'accès en lecture
router.use("/read", requireCategoryReadAccess);
// Route pour valider les données avant traitement
router.use("/validate", validateCategoryData);
export default router;
