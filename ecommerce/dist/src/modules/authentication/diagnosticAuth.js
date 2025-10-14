// import { Request, Response, NextFunction } from "express";
// import { PrismaClient } from "@prisma/client";
export {};
// const prisma = new PrismaClient();
// /**
//  * Module de diagnostic pour les problèmes d'authentification
//  * Ce module aide à identifier et résoudre les erreurs 401
//  */
// /**
//  * Middleware de diagnostic complet
//  */
// export const diagnosticMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("\n=== DIAGNOSTIC AUTHENTIFICATION ===");
//   console.log(`Timestamp: ${new Date().toISOString()}`);
//   console.log(`Route: ${req.method} ${req.originalUrl}`);
//   console.log(`IP: ${req.ip}`);
//   console.log(`User-Agent: ${req.get('User-Agent')?.substring(0, 100)}...`);
//   // Vérifier les headers d'authentification
//   const authHeader = req.headers.authorization;
//   console.log(`Authorization Header: ${authHeader ? 'PRÉSENT' : 'ABSENT'}`);
//   if (authHeader) {
//     const parts = authHeader.split(' ');
//     console.log(`Auth Type: ${parts[0]}`);
//     console.log(`Token Length: ${parts[1]?.length || 0} caractères`);
//   }
//   // Vérifier les cookies
//   console.log(`Cookies disponibles: ${Object.keys(req.cookies || {}).join(', ') || 'AUCUN'}`);
//   if (req.cookies) {
//     if (req.cookies.accessToken) {
//       console.log(`Cookie accessToken: ${req.cookies.accessToken.substring(0, 20)}...`);
//     }
//     if (req.cookies.auth_token) {
//       console.log(`Cookie auth_token: ${req.cookies.auth_token.substring(0, 20)}...`);
//     }
//   }
//   // Vérifier les paramètres de requête
//   console.log(`Query params: ${JSON.stringify(req.query)}`);
//   // Informations sur l'utilisateur (si disponible)
//   if (req.user) {
//     console.log(`Utilisateur authentifié:`, {
//       id: req.user.id,
//       type: req.user.type,
//       entrepriseId: req.user.entrepriseId,
//       actif: req.user.actif
//     });
//   } else {
//     console.log(`Utilisateur: NON AUTHENTIFIÉ`);
//   }
//   console.log("=====================================\n");
//   next();
// };
// /**
//  * Endpoint de diagnostic pour tester l'authentification
//  */
// export const authTestEndpoint = async (req: Request, res: Response) => {
//   try {
//     const result = {
//       timestamp: new Date().toISOString(),
//       route: `${req.method} ${req.originalUrl}`,
//       authenticated: !!req.user,
//       user: req.user || null,
//       headers: {
//         authorization: !!req.headers.authorization,
//         contentType: req.headers['content-type'],
//         userAgent: req.headers['user-agent']?.substring(0, 50)
//       },
//       cookies: Object.keys(req.cookies || {}),
//       query: req.query,
//       body: req.body ? Object.keys(req.body) : []
//     };
//     console.log("Test d'authentification:", result);
//     res.json({
//       success: true,
//       message: "Test d'authentification réalisé avec succès",
//       data: result
//     });
//   } catch (error) {
//     console.error("Erreur lors du test d'authentification:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors du test d'authentification",
//       details: error instanceof Error ? error.message : "Erreur inconnue"
//     });
//   }
// };
// /**
//  * Endpoint pour vérifier la validité d'un token
//  */
// export const tokenValidationEndpoint = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.body;
//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         error: "Token requis dans le body de la requête"
//       });
//     }
//     // Ici, vous pouvez ajouter la logique de validation du token
//     // Pour l'instant, on retourne juste les informations de base
//     res.json({
//       success: true,
//       message: "Validation de token",
//       tokenLength: token.length,
//       tokenStart: token.substring(0, 20)
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors de la validation du token"
//     });
//   }
// };
// /**
//  * Endpoint pour vérifier la connectivité à la base de données
//  */
// export const dbConnectivityTest = async (req: Request, res: Response) => {
//   try {
//     // Test simple de connectivité
//     const userCount = await prisma.utilisateur.count();
//     const enterpriseCount = await prisma.entreprise.count();
//     res.json({
//       success: true,
//       message: "Base de données accessible",
//       data: {
//         userCount,
//         enterpriseCount,
//         timestamp: new Date().toISOString()
//       }
//     });
//   } catch (error) {
//     console.error("Erreur de connectivité DB:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur de connectivité à la base de données",
//       details: error instanceof Error ? error.message : "Erreur inconnue"
//     });
//   }
// };
// import { Router } from "express";
// /**
//  * Créer les routes de diagnostic
//  */
// export const createDiagnosticRoutes = () => {
//   const router = Router();
//   // Route de test d'authentification (sans middleware auth)
//   router.get("/test-auth", diagnosticMiddleware, authTestEndpoint);
//   // Route de validation de token
//   router.post("/validate-token", tokenValidationEndpoint);
//   // Route de test de connectivité DB
//   router.get("/test-db", dbConnectivityTest);
//   // Route de diagnostic avancé (import dynamique pour éviter les dépendances circulaires)
//   router.get("/diagnose", async (req, res, next) => {
//     try {
//       const { authRecoveryMiddleware, diagnoseAuthIssues } = await import("./authRecovery.js");
//       return authRecoveryMiddleware(req, res, () => {
//         diagnoseAuthIssues(req, res);
//       });
//     } catch (error) {
//       console.error("Erreur lors du chargement du module authRecovery:", error);
//       res.status(500).json({
//         error: "Module de diagnostic non disponible",
//         code: "MODULE_ERROR"
//       });
//     }
//   });
//   return router;
// };
