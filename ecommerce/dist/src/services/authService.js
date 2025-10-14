import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
/**
 * Service d'authentification et gestion des utilisateurs
 */
export class AuthService {
    /**
     * Connexion d'un utilisateur
     */
    static async login(credentials) {
        try {
            const { email, password } = credentials;
            // Recherche de l'utilisateur avec les informations de l'entreprise
            const utilisateur = await prisma.utilisateur.findUnique({
                where: {
                    email: email.toLowerCase(),
                    deletedAt: null,
                },
                include: {
                    entreprise: {
                        select: {
                            id: true,
                            nom: true,
                            actif: true,
                            deletedAt: true,
                        },
                    },
                },
            });
            if (!utilisateur) {
                // Incrémenter les tentatives de connexion pour la sécurité
                await AuthService.incrementFailedAttempts(email);
                return {
                    success: false,
                    error: "Email ou mot de passe incorrect",
                    code: "INVALID_CREDENTIALS",
                };
            }
            // Vérification si l'utilisateur est actif
            if (!utilisateur.actif) {
                return {
                    success: false,
                    error: "Compte utilisateur désactivé",
                    code: "USER_DEACTIVATED",
                };
            }
            // Vérification si l'entreprise est active
            if (!utilisateur.entreprise ||
                !utilisateur.entreprise.actif ||
                utilisateur.entreprise.deletedAt) {
                return {
                    success: false,
                    error: "Entreprise inactive ou supprimée",
                    code: "COMPANY_INACTIVE",
                };
            }
            // Vérification du nombre de tentatives de connexion
            if (utilisateur.tentativesConnexion >= 5) {
                return {
                    success: false,
                    error: "Compte verrouillé après trop de tentatives de connexion",
                    code: "ACCOUNT_LOCKED",
                };
            }
            // Vérification de l'expiration du compte
            if (utilisateur.dateExpiration &&
                utilisateur.dateExpiration < new Date()) {
                return {
                    success: false,
                    error: "Compte expiré",
                    code: "ACCOUNT_EXPIRED",
                };
            }
            // Vérification du mot de passe
            const isPasswordValid = await bcrypt.compare(password, utilisateur.password);
            if (!isPasswordValid) {
                // Incrémenter les tentatives échouées
                await prisma.utilisateur.update({
                    where: { id: utilisateur.id },
                    data: {
                        tentativesConnexion: utilisateur.tentativesConnexion + 1,
                    },
                });
                return {
                    success: false,
                    error: "Email ou mot de passe incorrect",
                    code: "INVALID_CREDENTIALS",
                };
            }
            // Réinitialiser les tentatives de connexion et mettre à jour le dernier accès
            await prisma.utilisateur.update({
                where: { id: utilisateur.id },
                data: {
                    tentativesConnexion: 0,
                    dernierAcces: new Date(),
                },
            });
            // Génération du token JWT
            const jwtSecret = process.env.JWT_SECRET || "default-secret";
            const payload = {
                userId: utilisateur.id,
                email: utilisateur.email,
                type: utilisateur.type,
                entrepriseId: utilisateur.entrepriseId,
            };
            const options = {
                expiresIn: process.env.JWT_EXPIRES_IN || "24h",
                issuer: "gestion-paie-app",
                algorithm: "HS256",
            };
            const token = jwt.sign(payload, jwtSecret, options);
            console.log(`token : ${token}`);
            // Enregistrement de l'audit de connexion
            await AuthService.logAudit({
                action: "LOGIN",
                description: `Connexion réussie pour ${utilisateur.email}`,
                utilisateurId: utilisateur.id,
                entrepriseId: utilisateur.entrepriseId || undefined,
                ip: null, // À passer depuis le contrôleur
            });
            return {
                success: true,
                token,
                user: {
                    id: utilisateur.id,
                    nom: utilisateur.nom,
                    prenom: utilisateur.prenom,
                    email: utilisateur.email,
                    type: utilisateur.type,
                    entreprise: {
                        id: utilisateur.entreprise?.id || "",
                        nom: utilisateur.entreprise?.nom || "",
                    },
                },
            };
        }
        catch (error) {
            console.error("Erreur lors de la connexion:", error);
            return {
                success: false,
                error: "Erreur interne du serveur",
                code: "INTERNAL_ERROR",
            };
        }
    }
    /**
     * Création d'un nouvel utilisateur
     */
    static async register(userData) {
        try {
            // Vérification si l'email existe déjà
            const existingUser = await prisma.utilisateur.findUnique({
                where: { email: userData.email.toLowerCase() },
            });
            if (existingUser) {
                return {
                    success: false,
                    error: "Cet email est déjà utilisé",
                    code: "EMAIL_ALREADY_EXISTS",
                };
            }
            // Vérification si l'entreprise existe et est active
            const entreprise = await prisma.entreprise.findUnique({
                where: {
                    id: userData.entrepriseId,
                    deletedAt: null,
                    actif: true,
                },
            });
            if (!entreprise) {
                return {
                    success: false,
                    error: "Entreprise non trouvée ou inactive",
                    code: "COMPANY_NOT_FOUND",
                };
            }
            // Hashage du mot de passe
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            // Création de l'utilisateur
            const nouvelUtilisateur = await prisma.utilisateur.create({
                data: {
                    nom: userData.nom,
                    prenom: userData.prenom,
                    email: userData.email.toLowerCase(),
                    password: hashedPassword,
                    type: userData.type,
                    telephone: userData.telephone,
                    entreprise: { connect: { id: userData.entrepriseId } },
                    actif: true,
                },
                include: {
                    entreprise: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                },
            });
            // Enregistrement de l'audit de création
            await AuthService.logAudit({
                action: "CREATE",
                entity: "Utilisateur",
                entityId: nouvelUtilisateur.id,
                description: `Création de l'utilisateur ${nouvelUtilisateur.email}`,
                entrepriseId: nouvelUtilisateur.entrepriseId || undefined,
                ip: null,
            });
            // Génération du token pour l'auto-connexion
            const jwtSecret = process.env.JWT_SECRET || "default-secret";
            const payload = {
                userId: nouvelUtilisateur.id,
                email: nouvelUtilisateur.email,
                type: nouvelUtilisateur.type,
                entrepriseId: nouvelUtilisateur.entrepriseId,
            };
            const options = {
                expiresIn: process.env.JWT_EXPIRES_IN || "24h",
                issuer: "gestion-paie-app",
                algorithm: "HS256",
            };
            const token = jwt.sign(payload, jwtSecret, options);
            return {
                success: true,
                token,
                user: {
                    id: nouvelUtilisateur.id,
                    nom: nouvelUtilisateur.nom,
                    prenom: nouvelUtilisateur.prenom,
                    email: nouvelUtilisateur.email,
                    type: nouvelUtilisateur.type,
                    entreprise: nouvelUtilisateur.entreprise || { id: "", nom: "" },
                },
            };
        }
        catch (error) {
            console.error("Erreur lors de la création d'utilisateur:", error);
            return {
                success: false,
                error: "Erreur interne du serveur",
                code: "INTERNAL_ERROR",
            };
        }
    }
    /**
     * Déconnexion d'un utilisateur
     */
    static async logout(userId, ip) {
        try {
            const utilisateur = await prisma.utilisateur.findUnique({
                where: { id: userId },
            });
            if (utilisateur) {
                // Enregistrement de l'audit de déconnexion
                await AuthService.logAudit({
                    action: "LOGOUT",
                    description: `Déconnexion de ${utilisateur.email}`,
                    utilisateurId: userId,
                    entrepriseId: utilisateur.entrepriseId || undefined,
                    ip,
                });
            }
        }
        catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    }
    /**
     * Changement de mot de passe
     */
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const utilisateur = await prisma.utilisateur.findUnique({
                where: { id: userId, deletedAt: null },
            });
            if (!utilisateur) {
                return { success: false, error: "Utilisateur non trouvé" };
            }
            // Vérification du mot de passe actuel
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, utilisateur.password);
            if (!isCurrentPasswordValid) {
                return { success: false, error: "Mot de passe actuel incorrect" };
            }
            // Hashage du nouveau mot de passe
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);
            // Mise à jour du mot de passe
            await prisma.utilisateur.update({
                where: { id: userId },
                data: {
                    password: hashedNewPassword,
                    tentativesConnexion: 0, // Réinitialiser les tentatives
                },
            });
            // Enregistrement de l'audit
            await AuthService.logAudit({
                action: "UPDATE",
                entity: "Utilisateur",
                entityId: userId,
                description: "Changement de mot de passe",
                utilisateurId: userId,
                entrepriseId: utilisateur.entrepriseId || undefined,
            });
            return { success: true };
        }
        catch (error) {
            console.error("Erreur lors du changement de mot de passe:", error);
            return { success: false, error: "Erreur interne du serveur" };
        }
    }
    /**
     * Incrémenter les tentatives de connexion échouées
     */
    static async incrementFailedAttempts(email) {
        try {
            const user = await prisma.utilisateur.findUnique({
                where: { email: email.toLowerCase() },
            });
            if (user) {
                await prisma.utilisateur.update({
                    where: { id: user.id },
                    data: { tentativesConnexion: user.tentativesConnexion + 1 },
                });
            }
        }
        catch (error) {
            console.error("Erreur lors de l'incrémentation des tentatives:", error);
        }
    }
    /**
     * Enregistrement d'audit
     */
    static async logAudit(auditData) {
        try {
            await prisma.auditLog.create({
                data: {
                    action: auditData.action,
                    entity: auditData.entity || "Authentification",
                    entityId: auditData.entityId,
                    description: auditData.description,
                    utilisateurId: auditData.utilisateurId,
                    entrepriseId: auditData.entrepriseId,
                    ip: auditData.ip,
                    niveau: "INFO",
                    risque: "LOW",
                },
            });
        }
        catch (error) {
            console.error("Erreur lors de l'enregistrement d'audit:", error);
        }
    }
    /**
     * Vérification de la validité d'un token
     */
    static verifyToken(token) {
        try {
            const jwtSecret = process.env.JWT_SECRET || "default-secret";
            const decoded = jwt.verify(token, jwtSecret);
            return { valid: true, decoded };
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return { valid: false, error: "Token invalide" };
            }
            if (error instanceof jwt.TokenExpiredError) {
                return { valid: false, error: "Token expiré" };
            }
            return { valid: false, error: "Erreur de vérification du token" };
        }
    }
    /**
     * Réinitialisation du compteur de tentatives de connexion
     */
    static async resetFailedAttempts(email) {
        try {
            await prisma.utilisateur.updateMany({
                where: {
                    email: email.toLowerCase(),
                    tentativesConnexion: { gt: 0 },
                },
                data: { tentativesConnexion: 0 },
            });
        }
        catch (error) {
            console.error("Erreur lors de la réinitialisation des tentatives:", error);
        }
    }
}
