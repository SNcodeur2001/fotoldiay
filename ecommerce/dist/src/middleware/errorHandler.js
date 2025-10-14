// src/middleware/errorHandler.ts
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { UserMessages } from "../modules/utilisateur/utilisateur.enum.js";
import { CategoryMessages } from "../modules/category/category.enum.js";
import { BaseMessages, HttpStatusCodes, } from "../modules/abstract/abstract.enum.js";
export const errorHandler = (error, req, res, next) => {
    console.error("❌ Erreur capturée:", error);
    // Erreurs de validation Zod
    if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
        }));
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: BaseMessages.VALIDATION_ERROR,
            details: formattedErrors,
            type: "VALIDATION_ERROR",
        });
    }
    // Erreurs Prisma
    if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002": // Contrainte d'unicité violée
                const field = error.meta?.target;
                let message = BaseMessages.INVALID_REQUEST;
                if (field?.includes("email")) {
                    message = UserMessages.EMAIL_ALREADY_EXISTS;
                }
                else if (field?.includes("telephone")) {
                    message = UserMessages.TELEPHONE_ALREADY_EXISTS;
                }
                else if (field?.includes("libelle")) {
                    message = CategoryMessages.LIBELLE_ALREADY_EXISTS;
                }
                return res.status(HttpStatusCodes.CONFLICT).json({
                    error: message,
                    field: field?.[0] || "unknown",
                    type: "UNIQUE_CONSTRAINT_ERROR",
                });
            case "P2025": // Enregistrement non trouvé
                return res.status(HttpStatusCodes.NOT_FOUND).json({
                    error: BaseMessages.NOT_FOUND,
                    type: "NOT_FOUND_ERROR",
                });
            case "P2003": // Contrainte de clé étrangère violée
                return res.status(HttpStatusCodes.BAD_REQUEST).json({
                    error: "Référence invalide - l'élément référencé n'existe pas",
                    type: "FOREIGN_KEY_ERROR",
                });
            case "P2021": // Table n'existe pas
                return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: "Erreur de configuration de la base de données",
                    type: "DATABASE_ERROR",
                });
            default:
                console.error("Erreur Prisma non gérée:", error.code, error.message);
                return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: BaseMessages.INTERNAL_ERROR,
                    code: error.code,
                    type: "DATABASE_ERROR",
                });
        }
    }
    // Erreurs HTTP personnalisées
    if (error.status) {
        return res.status(error.status).json({
            error: error.message,
            type: "HTTP_ERROR",
        });
    }
    // Erreur générique
    console.error("Erreur non gérée:", error);
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: BaseMessages.INTERNAL_ERROR,
        type: "INTERNAL_ERROR",
    });
};
export default errorHandler;
