// import { Request, Response } from "express";
// import { AuthService } from "../services/authService.js";
// import { TypeUtilisateur } from "../types/permissions.js";
export {};
// /**
//  * Contrôleur pour la gestion de l'authentification et des utilisateurs
//  */
// export class AuthController {
//   /**
//    * POST /api/auth/login
//    * Connexion d'un utilisateur
//    */
//   static async login(req: Request, res: Response) {
//     try {
//       const { login, password } = req.body;
//       // Validation des données
//       if (!login || !password) {
//         return res.status(400).json({
//           success: false,
//           error: "Login et mot de passe requis",
//           code: "MISSING_CREDENTIALS",
//         });
//       }
//       // Tentative de connexion
//       const result = await AuthService.login({ email: login, password });
//       if (!result.success) {
//         return res.status(401).json(result);
//       }
//       // Connexion réussie : renvoyer accessToken et infos utilisateur
//       if (result.success) {
//         const { token, user } = result;
//         return res.status(200).json({
//           message: "Connexion reussi",
//           accessToken: token,
//           user,
//         });
//       }
//       return res.status(401).json(result);
//     } catch (error) {
//       console.error("Erreur lors de la connexion:", error);
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
//   /**
//    * POST /api/auth/register
//    * Création d'un nouvel utilisateur (réservé aux ADMIN et SUPER_ADMIN)
//    */
//   static async register(req: Request, res: Response) {
//     try {
//       const { nom, prenom, email, password, type, telephone, entrepriseId } =
//         req.body;
//       // Validation des données obligatoires
//       if (!nom || !prenom || !email || !password || !type || !entrepriseId) {
//         return res.status(400).json({
//           success: false,
//           error: "Tous les champs obligatoires doivent être renseignés",
//           code: "MISSING_REQUIRED_FIELDS",
//         });
//       }
//       // Validation du type d'utilisateur
//       if (!Object.values(TypeUtilisateur).includes(type)) {
//         return res.status(400).json({
//           success: false,
//           error: "Type d'utilisateur invalide",
//           code: "INVALID_USER_TYPE",
//         });
//       }
//       // Vérification des permissions (seuls ADMIN et SUPER_ADMIN peuvent créer des utilisateurs)
//       if (
//         req.user &&
//         ![TypeUtilisateur.SUPER_ADMIN, TypeUtilisateur.ADMIN].includes(
//           req.user.type
//         )
//       ) {
//         return res.status(403).json({
//           success: false,
//           error: "Permissions insuffisantes pour créer un utilisateur",
//           code: "INSUFFICIENT_PERMISSIONS",
//         });
//       }
//       // Un ADMIN ne peut créer que des utilisateurs dans sa propre entreprise
//       if (
//         req.user &&
//         req.user.type === TypeUtilisateur.ADMIN &&
//         req.user.entrepriseId !== entrepriseId
//       ) {
//         return res.status(403).json({
//           success: false,
//           error:
//             "Vous ne pouvez créer des utilisateurs que dans votre entreprise",
//           code: "COMPANY_ACCESS_DENIED",
//         });
//       }
//       // Validation de l'email
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({
//           success: false,
//           error: "Format d'email invalide",
//           code: "INVALID_EMAIL_FORMAT",
//         });
//       }
//       // Validation du mot de passe (minimum 8 caractères)
//       if (password.length < 8) {
//         return res.status(400).json({
//           success: false,
//           error: "Le mot de passe doit contenir au moins 8 caractères",
//           code: "WEAK_PASSWORD",
//         });
//       }
//       // Création de l'utilisateur
//       const result = await AuthService.register({
//         nom: nom.trim(),
//         prenom: prenom.trim(),
//         email: email.toLowerCase().trim(),
//         password,
//         type,
//         telephone: telephone?.trim(),
//         entrepriseId,
//       });
//       if (!result.success) {
//         return res.status(400).json(result);
//       }
//       return res.status(201).json(result);
//     } catch (error) {
//       console.error("Erreur lors de la création d'utilisateur:", error);
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
//   /**
//    * POST /api/auth/logout
//    * Déconnexion d'un utilisateur
//    */
//   static async logout(req: Request, res: Response) {
//     try {
//       if (req.user) {
//         const ip = req.ip || req.connection.remoteAddress;
//         await AuthService.logout(req.user.id, ip);
//       }
//       return res.status(200).json({
//         success: true,
//         message: "Déconnexion réussie",
//       });
//     } catch (error) {
//       console.error("Erreur lors de la déconnexion:", error);
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
//   /**
//    * POST /api/auth/change-password
//    * Changement de mot de passe
//    */
//   static async changePassword(req: Request, res: Response) {
//     try {
//       const { currentPassword, newPassword } = req.body;
//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           error: "Authentification requise",
//           code: "AUTHENTICATION_REQUIRED",
//         });
//       }
//       // Validation des données
//       if (!currentPassword || !newPassword) {
//         return res.status(400).json({
//           success: false,
//           error: "Mot de passe actuel et nouveau mot de passe requis",
//           code: "MISSING_PASSWORDS",
//         });
//       }
//       // Validation du nouveau mot de passe
//       if (newPassword.length < 8) {
//         return res.status(400).json({
//           success: false,
//           error: "Le nouveau mot de passe doit contenir au moins 8 caractères",
//           code: "WEAK_PASSWORD",
//         });
//       }
//       if (currentPassword === newPassword) {
//         return res.status(400).json({
//           success: false,
//           error: "Le nouveau mot de passe doit être différent de l'ancien",
//           code: "SAME_PASSWORD",
//         });
//       }
//       // Changement du mot de passe
//       const result = await AuthService.changePassword(
//         req.user.id,
//         currentPassword,
//         newPassword
//       );
//       if (!result.success) {
//         return res.status(400).json({
//           success: false,
//           error: result.error,
//           code: "PASSWORD_CHANGE_FAILED",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         message: "Mot de passe modifié avec succès",
//       });
//     } catch (error) {
//       console.error("Erreur lors du changement de mot de passe:", error);
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
//   /**
//    * GET /api/auth/profile
//    * Récupération du profil de l'utilisateur connecté
//    */
//   static async getProfile(req: Request, res: Response) {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           error: "Authentification requise",
//           code: "AUTHENTICATION_REQUIRED",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         user: req.user,
//       });
//     } catch (error) {
//       console.error("Erreur lors de la récupération du profil:", error);
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
//   /**
//    * POST /api/auth/verify-token
//    * Vérification de la validité d'un token
//    */
//   static async verifyToken(req: Request, res: Response) {
//     try {
//       const { token } = req.body;
//       if (!token) {
//         return res.status(400).json({
//           success: false,
//           error: "Token requis",
//           code: "MISSING_TOKEN",
//         });
//       }
//       const result = AuthService.verifyToken(token);
//       if (!result.valid) {
//         return res.status(401).json({
//           success: false,
//           error: result.error,
//           code: "INVALID_TOKEN",
//         });
//       }
//       return res.status(200).json({
//         success: true,
//         valid: true,
//         decoded: result.decoded,
//       });
//     } catch (error) {
//       console.error("Erreur lors de la vérification du token:", error);
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
//   /**
//    * POST /api/auth/reset-failed-attempts
//    * Réinitialisation des tentatives de connexion échouées (SUPER_ADMIN uniquement)
//    */
//   static async resetFailedAttempts(req: Request, res: Response) {
//     try {
//       const { email } = req.body;
//       if (!req.user || req.user.type !== TypeUtilisateur.SUPER_ADMIN) {
//         return res.status(403).json({
//           success: false,
//           error: "Accès réservé aux super administrateurs",
//           code: "SUPER_ADMIN_REQUIRED",
//         });
//       }
//       if (!email) {
//         return res.status(400).json({
//           success: false,
//           error: "Email requis",
//           code: "MISSING_EMAIL",
//         });
//       }
//       await AuthService.resetFailedAttempts(email);
//       return res.status(200).json({
//         success: true,
//         message: "Tentatives de connexion réinitialisées avec succès",
//       });
//     } catch (error) {
//       console.error(
//         "Erreur lors de la réinitialisation des tentatives:",
//         error
//       );
//       return res.status(500).json({
//         success: false,
//         error: "Erreur interne du serveur",
//         code: "INTERNAL_ERROR",
//       });
//     }
//   }
// }
