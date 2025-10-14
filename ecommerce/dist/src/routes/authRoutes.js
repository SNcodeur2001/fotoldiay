// import { Router } from 'express';
// import { AuthController } from '../controllers/authController.js';
// import { authenticateToken, authorize } from '../middleware/auth.js';
// import { Action, Resource } from '../types/permissions.js';
export {};
// const router = Router();
// /**
//  * Routes publiques (sans authentification)
//  */
// // POST /api/auth/login - Connexion
// router.post('/login', AuthController.login);
// // POST /api/auth/verify-token - Vérification de token
// router.post('/verify-token', AuthController.verifyToken);
// /**
//  * Routes protégées (avec authentification)
//  */
// // POST /api/auth/logout - Déconnexion
// router.post('/logout', authenticateToken, AuthController.logout);
// // GET /api/auth/profile - Profil utilisateur
// router.get('/profile', authenticateToken, AuthController.getProfile);
// // POST /api/auth/change-password - Changement de mot de passe
// router.post('/change-password', authenticateToken, AuthController.changePassword);
// // POST /api/auth/register - Création d'utilisateur (ADMIN/SUPER_ADMIN uniquement)
// router.post('/register',
//   authenticateToken,
//   authorize(Action.CREATE, Resource.UTILISATEUR),
//   AuthController.register
// );
// // POST /api/auth/reset-failed-attempts - Reset tentatives (SUPER_ADMIN uniquement)
// router.post('/reset-failed-attempts',
//   authenticateToken,
//   // Pas besoin d'authorize ici car la vérification est faite dans le contrôleur
//   AuthController.resetFailedAttempts
// );
// export default router;
