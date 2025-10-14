// src/modules/utilisateur/middleware/validateUserUniqueness.ts
import prisma from "../../../prismaClient.js";
import { UserMessages } from "../utilisateur.enum.js";
import { HttpStatusCodes } from "../../abstract/abstract.enum.js";
export const validateUserUniqueness = async (req, res, next) => {
    try {
        const { email, telephone } = req.body;
        const userId = req.params.id; // Pour les mises à jour
        // Vérification de l'email
        if (email) {
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUserByEmail && existingUserByEmail.id !== userId) {
                return res.status(HttpStatusCodes.CONFLICT).json({
                    error: UserMessages.EMAIL_ALREADY_EXISTS,
                    field: "email",
                    type: "UNIQUE_CONSTRAINT_ERROR",
                });
            }
        }
        // Vérification du téléphone
        if (telephone) {
            const existingUserByPhone = await prisma.user.findUnique({
                where: { telephone },
            });
            if (existingUserByPhone && existingUserByPhone.id !== userId) {
                return res.status(HttpStatusCodes.CONFLICT).json({
                    error: UserMessages.TELEPHONE_ALREADY_EXISTS,
                    field: "telephone",
                    type: "UNIQUE_CONSTRAINT_ERROR",
                });
            }
        }
        next();
    }
    catch (error) {
        console.error("Erreur lors de la validation d'unicité:", error);
        next(error);
    }
};
export default validateUserUniqueness;
