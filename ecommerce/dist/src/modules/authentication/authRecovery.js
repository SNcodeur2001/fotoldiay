// import { Request, Response, NextFunction } from "express";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
export {};
// const prisma = new PrismaClient();
// /**
//  * Module de résolution automatique des problèmes d'authentification
//  * Ce module tente de corriger automatiquement les erreurs 401
//  */
// /**
//  * Middleware de récupération d'authentification
//  * Tente de résoudre automatiquement les problèmes d'auth
//  */
// export const authRecoveryMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log("[AUTH_RECOVERY] Tentative de récupération d'authentification");
//     // Si déjà authentifié, continuer
//     if (req.user) {
//       console.log("[AUTH_RECOVERY] Utilisateur déjà authentifié");
//       return next();
//     }
//     // Tenter de récupérer le token depuis différentes sources
//     let token: string | null = null;
//     let source = "";
//     // 1. Header Authorization
//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       token = authHeader.substring(7);
//       source = "Authorization Header";
//     }
//     // 2. Cookies
//     if (!token && req.cookies) {
//       if (req.cookies.accessToken) {
//         token = req.cookies.accessToken;
//         source = "accessToken Cookie";
//       } else if (req.cookies.auth_token) {
//         token = req.cookies.auth_token;
//         source = "auth_token Cookie";
//       } else if (req.cookies.jwt) {
//         token = req.cookies.jwt;
//         source = "jwt Cookie";
//       }
//     }
//     // 3. Query parameters (pour debug uniquement)
//     if (!token && req.query.token) {
//       token = req.query.token as string;
//       source = "Query Parameter";
//       console.warn("[AUTH_RECOVERY] Token depuis query param - uniquement pour debug!");
//     }
//     if (!token) {
//       console.log("[AUTH_RECOVERY] Aucun token trouvé");
//       return res.status(401).json({
//         error: "Token d'authentification requis",
//         code: "MISSING_TOKEN",
//         suggestions: [
//           "Vérifiez que le token est envoyé dans le header Authorization: Bearer <token>",
//           "Vérifiez que le cookie accessToken ou auth_token est présent",
//           "Assurez-vous que l'utilisateur est connecté côté frontend"
//         ]
//       });
//     }
//     console.log(`[AUTH_RECOVERY] Token trouvé via: ${source}`);
//     // Vérifier et décoder le token
//     const jwtSecret = process.env.JWT_SECRET || "default-secret";
//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
//     } catch (jwtError) {
//       console.error("[AUTH_RECOVERY] Erreur de vérification JWT:", jwtError);
//       let errorMessage = "Token invalide";
//       let suggestions: string[] = [];
//       if (jwtError instanceof jwt.TokenExpiredError) {
//         errorMessage = "Token expiré";
//         suggestions = [
//           "Le token a expiré, l'utilisateur doit se reconnecter",
//           "Implémentez un mécanisme de refresh token",
//           "Vérifiez la durée de vie des tokens JWT"
//         ];
//       } else if (jwtError instanceof jwt.JsonWebTokenError) {
//         errorMessage = "Token malformé";
//         suggestions = [
//           "Vérifiez que le token est correctement formaté",
//           "Assurez-vous que JWT_SECRET est identique entre le frontend et backend",
//           "Vérifiez l'algorithme utilisé pour signer le token"
//         ];
//       }
//       return res.status(401).json({
//         error: errorMessage,
//         code: "INVALID_TOKEN",
//         suggestions
//       });
//     }
//     // Valider la structure du payload
//     if (!decoded.userId || !decoded.email || !decoded.type) {
//       console.error("[AUTH_RECOVERY] Payload JWT incomplet:", decoded);
//       return res.status(401).json({
//         error: "Token invalide - informations manquantes",
//         code: "INCOMPLETE_TOKEN_PAYLOAD",
//         suggestions: [
//           "Le token ne contient pas toutes les informations requises",
//           "Vérifiez la génération du token côté authentification",
//           "Assurez-vous d'inclure: userId, email, type"
//         ]
//       });
//     }
//     // Pour les SUPER_ADMIN, entrepriseId peut être null
//     if (decoded.type !== "SUPER_ADMIN" && !decoded.entrepriseId) {
//       console.error("[AUTH_RECOVERY] entrepriseId manquant pour utilisateur non SUPER_ADMIN:", decoded);
//       return res.status(401).json({
//         error: "Token invalide - entrepriseId manquant",
//         code: "MISSING_ENTERPRISE_ID",
//         suggestions: [
//           "Les utilisateurs non SUPER_ADMIN doivent avoir un entrepriseId",
//           "Vérifiez l'affectation de l'utilisateur à une entreprise"
//         ]
//       });
//     }
//     // Vérifier l'utilisateur en base
//     const utilisateur = await prisma.utilisateur.findUnique({
//       where: {
//         id: decoded.userId,
//         deletedAt: null,
//         actif: true,
//       },
//       include: {
//         entreprise: decoded.entrepriseId ? {
//           select: {
//             id: true,
//             actif: true,
//             deletedAt: true,
//           },
//         } : undefined,
//       },
//     });
//     if (!utilisateur) {
//       console.error("[AUTH_RECOVERY] Utilisateur non trouvé:", decoded.userId);
//       return res.status(401).json({
//         error: "Utilisateur non trouvé ou inactif",
//         code: "USER_NOT_FOUND",
//         suggestions: [
//           "L'utilisateur a peut-être été supprimé ou désactivé",
//           "Vérifiez l'état de l'utilisateur en base de données",
//           "L'utilisateur doit se reconnecter"
//         ]
//       });
//     }
//     // Vérification de l'entreprise uniquement si l'utilisateur n'est pas SUPER_ADMIN
//     if (decoded.type !== "SUPER_ADMIN") {
//       if (!utilisateur.entreprise || !utilisateur.entreprise.actif || utilisateur.entreprise.deletedAt) {
//         console.error("[AUTH_RECOVERY] Entreprise inactive:", utilisateur.entrepriseId);
//         return res.status(401).json({
//           error: "Entreprise inactive ou supprimée",
//           code: "COMPANY_INACTIVE",
//           suggestions: [
//             "L'entreprise de l'utilisateur est inactive",
//             "Contactez l'administrateur système",
//             "Vérifiez l'état de l'entreprise"
//           ]
//         });
//       }
//     }
//     // Créer le contexte utilisateur
//     req.user = {
//       id: utilisateur.id,
//       type: utilisateur.type as any,
//       entrepriseId: utilisateur.entrepriseId || "",
//       actif: utilisateur.actif,
//     };
//     console.log(`[AUTH_RECOVERY] Authentification récupérée avec succès pour ${utilisateur.email}`);
//     next();
//   } catch (error) {
//     console.error("[AUTH_RECOVERY] Erreur inattendue:", error);
//     return res.status(500).json({
//       error: "Erreur interne du serveur",
//       code: "INTERNAL_ERROR",
//       suggestions: [
//         "Erreur système inattendue",
//         "Vérifiez les logs du serveur",
//         "Contactez le support technique"
//       ]
//     });
//   }
// };
// /**
//  * Endpoint pour diagnostiquer les problèmes d'authentification
//  */
// export const diagnoseAuthIssues = async (req: Request, res: Response) => {
//   try {
//     const diagnosis = {
//       timestamp: new Date().toISOString(),
//       route: `${req.method} ${req.originalUrl}`,
//       headers: {
//         authorization: !!req.headers.authorization,
//         authorizationValue: req.headers.authorization ? 
//           `${req.headers.authorization.substring(0, 20)}...` : null,
//         contentType: req.headers['content-type'],
//         userAgent: req.headers['user-agent']?.substring(0, 50)
//       },
//       cookies: {
//         present: Object.keys(req.cookies || {}),
//         accessToken: req.cookies?.accessToken ? 
//           `${req.cookies.accessToken.substring(0, 20)}...` : null,
//         authToken: req.cookies?.auth_token ? 
//           `${req.cookies.auth_token.substring(0, 20)}...` : null
//       },
//       query: req.query,
//       user: req.user || null,
//       environment: {
//         jwtSecret: !!process.env.JWT_SECRET,
//         nodeEnv: process.env.NODE_ENV
//       }
//     };
//     // Diagnostic des problèmes courants
//     const issues = [];
//     const solutions = [];
//     if (!req.headers.authorization && !req.cookies?.accessToken && !req.cookies?.auth_token) {
//       issues.push("Aucun token d'authentification détecté");
//       solutions.push("Vérifiez que le frontend envoie le token dans les headers ou cookies");
//     }
//     if (!process.env.JWT_SECRET) {
//       issues.push("JWT_SECRET non configuré");
//       solutions.push("Configurez la variable d'environnement JWT_SECRET");
//     }
//     if (!req.user) {
//       issues.push("Utilisateur non authentifié");
//       solutions.push("Vérifiez la validité du token et l'état de l'utilisateur");
//     }
//     console.log("[DIAGNOSE] Diagnostic d'authentification:", diagnosis);
//     res.json({
//       success: true,
//       message: "Diagnostic d'authentification",
//       diagnosis,
//       issues,
//       solutions,
//       recommendations: [
//         "Utilisez HTTPS en production",
//         "Configurez correctement les cookies sécurisés",
//         "Implémentez un système de refresh token",
//         "Ajoutez des logs détaillés pour le debugging"
//       ]
//     });
//   } catch (error) {
//     console.error("[DIAGNOSE] Erreur lors du diagnostic:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur lors du diagnostic",
//       details: error instanceof Error ? error.message : "Erreur inconnue"
//     });
//   }
// };
