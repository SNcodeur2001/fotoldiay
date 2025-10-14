import { Router } from 'express';
import { EmployeController } from '../controllers/employeController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';
import { Action, Resource } from '../types/permissions.js';
const router = Router();
/**
 * Routes pour la gestion des employés
 * Toutes les routes nécessitent une authentification
 */
// GET /api/employes - Liste des employés (selon permissions)
router.get('/', authenticateToken, authorize(Action.READ, Resource.EMPLOYE), EmployeController.getEmployes);
// GET /api/employes/:id - Détails d'un employé (selon permissions)
router.get('/:id', authenticateToken, authorize(Action.READ, Resource.EMPLOYE), EmployeController.getEmploye);
// POST /api/employes - Création d'un employé (ADMIN/SUPER_ADMIN/MANAGER)
router.post('/', authenticateToken, authorize(Action.CREATE, Resource.EMPLOYE), EmployeController.createEmploye);
// PUT /api/employes/:id - Mise à jour d'un employé (selon permissions)
router.put('/:id', authenticateToken, authorize(Action.UPDATE, Resource.EMPLOYE), EmployeController.updateEmploye);
// DELETE /api/employes/:id - Suppression d'un employé (ADMIN/SUPER_ADMIN uniquement)
router.delete('/:id', authenticateToken, authorize(Action.DELETE, Resource.EMPLOYE), EmployeController.deleteEmploye);
export default router;
