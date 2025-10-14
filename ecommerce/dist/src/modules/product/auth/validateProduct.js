import { ProductStatus } from "@prisma/client";
import prisma from "../../../prismaClient.js";
// Validation des données du produit
export const validateProductData = async (req, res, next) => {
    const { title, price, categoryId, userId, status } = req.body;
    // Validation du titre
    if (title && (typeof title !== "string" || title.trim().length < 2)) {
        return res.status(400).json({
            error: "Le titre doit être une chaîne d'au moins 2 caractères",
        });
    }
    // Validation du prix
    if (price !== undefined) {
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({
                error: "Le prix doit être un nombre positif",
            });
        }
        req.body.price = priceNum;
    }
    // Validation de la catégorie
    if (categoryId) {
        try {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                return res.status(400).json({
                    error: "Catégorie non trouvée",
                });
            }
        }
        catch (error) {
            return res.status(400).json({
                error: "ID de catégorie invalide",
            });
        }
    }
    // Validation de l'utilisateur
    if (userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(400).json({
                    error: "Utilisateur non trouvé",
                });
            }
        }
        catch (error) {
            return res.status(400).json({
                error: "ID utilisateur invalide",
            });
        }
    }
    // Validation du statut
    if (status && !Object.values(ProductStatus).includes(status)) {
        return res.status(400).json({
            error: "Statut de produit invalide",
        });
    }
    next();
};
