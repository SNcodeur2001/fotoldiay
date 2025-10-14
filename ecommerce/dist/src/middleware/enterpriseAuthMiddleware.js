// import { Request, Response, NextFunction } from 'express';
// import { TypeUtilisateur } from '../types/permissions.js';
export {};
// // Étend Express pour inclure le contexte multi-entreprise
// declare global {
//   namespace Express {
//     interface Request {
//       context?: { entrepriseId: string };
//     }
//   }
// }
// /**
//  * Middleware d'authentification d'entreprise
//  * Règles:
//  * 1. SUPER_ADMIN -> passe sans contrainte
//  * 2. Autres rôles -> req.context = { entrepriseId: req.user.entrepriseId }
//  * 3. Si req.user invalide -> 401
//  */
// export function enterpriseAuthMiddleware(req: Request, res: Response, next: NextFunction) {
//   const user = req.user;
//   if (!user) {
//     return res.status(401).json({ error: 'Non autorisé: utilisateur manquant.' });
//   }
//   // Accès illimité pour SUPER_ADMIN
//   if (user.type === TypeUtilisateur.SUPER_ADMIN) {
//     return next();
//   }
//   // Les autres doivent avoir un entrepriseId
//   if (!user.entrepriseId) {
//     return res.status(401).json({ error: 'Non autorisé: entrepriseId manquant.' });
//   }
//   req.context = { entrepriseId: user.entrepriseId };
//   return next();
// }
