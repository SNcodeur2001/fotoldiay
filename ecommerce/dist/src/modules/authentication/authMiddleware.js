// import { Request, Response, NextFunction } from "express";
// import { TypeUtilisateur, Action, Resource } from "../../types/permissions.js";
// import { authenticateToken, authorize } from "../../middleware/auth.js";
export {};
// /**
//  * Middleware d'authentification et d'autorisation centralisé
//  * Ce module corrige les problèmes d'authentification 401 en appliquant
//  * les bons middlewares selon le type d'utilisateur et la ressource
//  */
// /**
//  * Middleware d'authentification avec gestion d'erreurs améliorée
//  */
// export const enhancedAuthMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(`[AUTH] Tentative d'accès à: ${req.method} ${req.path}`);
//   console.log(`[AUTH] Headers: ${JSON.stringify(req.headers.authorization)}`);
//   console.log(`[AUTH] Cookies: ${JSON.stringify(req.cookies)}`);
//   try {
//     await authenticateToken(req, res, next);
//   } catch (error) {
//     console.error('[AUTH] Erreur dans enhancedAuthMiddleware:', error);
//     return res.status(401).json({
//       error: "Erreur d'authentification",
//       code: "AUTHENTICATION_ERROR",
//       details: error instanceof Error ? error.message : "Erreur inconnue"
//     });
//   }
// };
// /**
//  * Middleware d'autorisation pour les utilisateurs
//  */
// export const authorizeUtilisateur = (action: Action) => {
//   return authorize(action, Resource.UTILISATEUR);
// };
// /**
//  * Middleware d'autorisation pour les employés
//  */
// export const authorizeEmploye = (action: Action) => {
//   return authorize(action, Resource.EMPLOYE);
// };
// /**
//  * Middleware d'autorisation pour les départements
//  */
// export const authorizeDepartement = (action: Action) => {
//   return authorize(action, Resource.DEPARTEMENT);
// };
// /**
//  * Middleware d'autorisation pour les entreprises
//  */
// export const authorizeEntreprise = (action: Action) => {
//   return authorize(action, Resource.ENTREPRISE);
// };
// /**
//  * Middleware d'autorisation pour les paiements
//  */
// export const authorizePaiement = (action: Action) => {
//   return authorize(action, Resource.PAIEMENT);
// };
// /**
//  * Middleware d'autorisation pour les présences
//  */
// export const authorizePresence = (action: Action) => {
//   return authorize(action, Resource.PRESENCE);
// };
// /**
//  * Middleware d'autorisation pour les congés
//  */
// export const authorizeConge = (action: Action) => {
//   return authorize(action, Resource.CONGE);
// };
// /**
//  * Middleware d'autorisation pour les bulletins de paie
//  */
// export const authorizePayslip = (action: Action) => {
//   return authorize(action, Resource.PAYSLIP);
// };
// /**
//  * Middleware d'autorisation pour les documents
//  */
// export const authorizeDocument = (action: Action) => {
//   return authorize(action, Resource.DOCUMENT);
// };
// /**
//  * Middleware pour vérifier l'accès aux ressources d'une entreprise spécifique
//  */
// export const checkEnterpriseAccess = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { entrepriseId } = req.query as { entrepriseId?: string };
//     if (!req.user) {
//       console.log('[AUTH] Utilisateur non authentifié');
//       return res.status(401).json({
//         error: "Authentification requise",
//         code: "AUTHENTICATION_REQUIRED"
//       });
//     }
//     // Les SUPER_ADMIN peuvent accéder à toutes les entreprises
//     if (req.user.type === TypeUtilisateur.SUPER_ADMIN) {
//       console.log('[AUTH] Accès autorisé: SUPER_ADMIN');
//       return next();
//     }
//     // Vérifier que l'utilisateur accède à sa propre entreprise
//     if (entrepriseId && req.user.entrepriseId !== entrepriseId) {
//       console.log(`[AUTH] Accès refusé: utilisateur ${req.user.id} (entreprise: ${req.user.entrepriseId}) tente d'accéder à l'entreprise ${entrepriseId}`);
//       return res.status(403).json({
//         error: "Accès refusé à cette entreprise",
//         code: "COMPANY_ACCESS_DENIED",
//         details: {
//           userCompany: req.user.entrepriseId,
//           requestedCompany: entrepriseId
//         }
//       });
//     }
//     console.log(`[AUTH] Accès autorisé: utilisateur ${req.user.id} à l'entreprise ${req.user.entrepriseId}`);
//     next();
//   } catch (error) {
//     console.error('[AUTH] Erreur dans checkEnterpriseAccess:', error);
//     return res.status(500).json({
//       error: "Erreur interne du serveur",
//       code: "INTERNAL_ERROR"
//     });
//   }
// };
// /**
//  * Middleware de débogage pour les problèmes d'authentification
//  */
// export const debugAuthMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log('=== DEBUG AUTH ===');
//   console.log(`Route: ${req.method} ${req.path}`);
//   console.log(`Query params:`, req.query);
//   console.log(`User:`, req.user ? {
//     id: req.user.id,
//     type: req.user.type,
//     entrepriseId: req.user.entrepriseId
//   } : 'undefined');
//   console.log(`Authorization header:`, req.headers.authorization ? 'présent' : 'absent');
//   console.log(`Cookies:`, Object.keys(req.cookies || {}));
//   console.log('==================');
//   next();
// };
