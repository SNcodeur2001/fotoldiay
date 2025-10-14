import { Router } from "express";
import PaiementController from "../modules/paiement/PaiementController.js";
import PrismaService from "../modules/abstract/PrismaService.js";
import { authenticateToken, authorize } from "../middleware/auth.js";
import { Action, Resource } from "../types/permissions.js";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();
// Création du service et du contrôleur
const paiementService = new PrismaService(prisma.paiement, "paiement");
const paiementController = new PaiementController(paiementService);
/**
 * Routes pour la gestion des paiements
 * Toutes les routes nécessitent une authentification
 */
// GET /api/paiements - Liste des paiements (selon permissions)
router.get("/", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.getAll.bind(paiementController));
// GET /api/paiements/:id - Détails d'un paiement (selon permissions)
router.get("/:id", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.getOne.bind(paiementController));
// POST /api/paiements - Création d'un paiement (ADMIN/CAISSIER)
router.post("/", authenticateToken, authorize(Action.CREATE, Resource.PAIEMENT), paiementController.createPaiement.bind(paiementController));
// PUT /api/paiements/:id - Mise à jour d'un paiement (selon permissions)
router.put("/:id", authenticateToken, authorize(Action.UPDATE, Resource.PAIEMENT), paiementController.update.bind(paiementController));
// DELETE /api/paiements/:id - Suppression d'un paiement (ADMIN uniquement)
router.delete("/:id", authenticateToken, authorize(Action.DELETE, Resource.PAIEMENT), paiementController.delete.bind(paiementController));
// GET /api/paiements/:id/recue - Télécharger le reçu PDF
router.get("/:id/recue", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.getPaiementRecu.bind(paiementController));
// Routes additionnelles spécifiques
router.get("/search", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.searchPaiements.bind(paiementController));
router.get("/by-payslip/:payslipId", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.getPaiementsByPayslip.bind(paiementController));
router.get("/by-employe/:employeId", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.getPaiementsByEmploye.bind(paiementController));
router.post("/validate-amount", authenticateToken, authorize(Action.READ, Resource.PAIEMENT), paiementController.validatePaymentAmount.bind(paiementController));
export default router;
