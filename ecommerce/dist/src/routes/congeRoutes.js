import { Router } from "express";
import { authenticateToken, authorize } from "../middleware/auth.js";
import { Action, Resource } from "../types/permissions.js";
// Services et controllers
import PrismaService from "../modules/abstract/PrismaService.js";
import CongeController from "../modules/conge/CongeController.js";
import prisma from "../prismaClient.js";
const router = Router();
// Initialiser le service et le contrôleur
const congeService = new PrismaService(prisma.conge, "conge");
const congeController = new CongeController(congeService);
// Toutes les routes nécessitent une authentification
router.use(authenticateToken);
// Routes CRUD de base
router.get("/", authorize(Action.READ, Resource.CONGE), congeController.getAll.bind(congeController));
router.post("/", authorize(Action.CREATE, Resource.CONGE), congeController.createConge.bind(congeController));
router.get("/:id", authorize(Action.READ, Resource.CONGE), congeController.getOne.bind(congeController));
router.put("/:id", authorize(Action.UPDATE, Resource.CONGE), congeController.update.bind(congeController));
router.delete("/:id", authorize(Action.DELETE, Resource.CONGE), congeController.delete.bind(congeController));
// Routes spécialisées pour la gestion des congés
// Liste des employés avec recherche
router.get("/employes", authorize(Action.READ, Resource.EMPLOYE), congeController.getEmployesList.bind(congeController));
// Recherche avancée de congés
router.get("/search", authorize(Action.READ, Resource.CONGE), congeController.searchConges.bind(congeController));
// Congés par employé
router.get("/by-employe/:employeId", authorize(Action.READ, Resource.CONGE), congeController.getCongesByEmploye.bind(congeController));
// Validation des dates
router.post("/validate-dates", authorize(Action.CREATE, Resource.CONGE), congeController.validateCongeDates.bind(congeController));
// Approbation/Rejet
router.put("/:id/approve", authorize(Action.APPROVE, Resource.CONGE), congeController.approveConge.bind(congeController));
router.put("/:id/reject", authorize(Action.REJECT, Resource.CONGE), congeController.rejectConge.bind(congeController));
// Statistiques
router.get("/stats/:employeId", authorize(Action.READ, Resource.CONGE), congeController.getEmployeCongeStats.bind(congeController));
// Types de congés
router.get("/types", congeController.getCongeTypes.bind(congeController));
export default router;
