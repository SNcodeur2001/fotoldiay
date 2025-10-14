import prisma from "../../../prismaClient.js";
// Validation des données de catégorie
export const validateCategoryData = async (req, res, next) => {
    const { libelle, description } = req.body;
    // Validation du libellé
    if (libelle && (typeof libelle !== "string" || libelle.trim().length < 2)) {
        return res.status(400).json({
            error: "Le libellé doit être une chaîne d'au moins 2 caractères",
        });
    }
    // Validation de la description
    if (description && typeof description !== "string") {
        return res.status(400).json({
            error: "La description doit être une chaîne de caractères",
        });
    }
    // Vérification de l'unicité du libellé lors de la création
    if (req.method === "POST" && libelle) {
        try {
            const existingCategory = await prisma.category.findUnique({
                where: { libelle: libelle.trim() },
            });
            if (existingCategory) {
                return res.status(409).json({
                    error: "Une catégorie avec ce libellé existe déjà",
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                error: "Erreur lors de la vérification du libellé",
            });
        }
    }
    // Vérification de l'unicité du libellé lors de la mise à jour
    if (req.method === "PUT" && libelle) {
        const { id } = req.params;
        try {
            const existingCategory = await prisma.category.findFirst({
                where: {
                    libelle: libelle.trim(),
                    NOT: { id },
                },
            });
            if (existingCategory) {
                return res.status(409).json({
                    error: "Une catégorie avec ce libellé existe déjà",
                });
            }
        }
        catch (error) {
            return res.status(500).json({
                error: "Erreur lors de la vérification du libellé",
            });
        }
    }
    // Nettoyer les données
    if (libelle) {
        req.body.libelle = libelle.trim();
    }
    if (description) {
        req.body.description = description.trim();
    }
    next();
};
