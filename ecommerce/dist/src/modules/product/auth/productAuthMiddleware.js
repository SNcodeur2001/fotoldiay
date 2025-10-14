// Middleware pour vérifier que l'utilisateur peut créer/modifier des produits
export const requireProductPermission = (req, res, next) => {
    // Supposons que req.user contient l'utilisateur authentifié
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Authentification requise" });
    }
    // Seuls les VENDEUR et GESTIONNAIRE peuvent créer/modifier des produits
    if (user.role !== "VENDEUR" && user.role !== "GESTIONNAIRE") {
        return res.status(403).json({
            error: "Permissions insuffisantes pour cette action",
        });
    }
    next();
};
// Middleware pour vérifier que l'utilisateur peut accéder à un produit spécifique
export const requireProductOwnership = (req, res, next) => {
    const user = req.user;
    const { userId } = req.params;
    if (!user) {
        return res.status(401).json({ error: "Authentification requise" });
    }
    // Les GESTIONNAIRE peuvent accéder à tous les produits
    // Les VENDEUR ne peuvent accéder qu'à leurs propres produits
    if (user.role === "GESTIONNAIRE") {
        return next();
    }
    if (user.role === "VENDEUR" && user.id === userId) {
        return next();
    }
    return res.status(403).json({
        error: "Vous ne pouvez pas accéder à ce produit",
    });
};
