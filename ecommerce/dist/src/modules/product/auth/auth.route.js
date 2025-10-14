import { Router } from "express";
import { requireProductPermission, requireProductOwnership, } from "./productAuthMiddleware.js";
import { validateProductData } from "./validateProduct.js";
const router = Router();
// Routes d'authentification spécifiques aux produits
// Ces routes peuvent être utilisées pour des actions spéciales sur les produits
// Route pour valider les permissions avant création
router.use("/create", requireProductPermission);
// Route pour valider la propriété avant modification
router.use("/update/:userId", requireProductOwnership);
// Route pour valider les données avant traitement
router.use("/validate", validateProductData);
export default router;
