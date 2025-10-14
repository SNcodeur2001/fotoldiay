import { Router } from "express";
export default function buildCategoryRoute(controller) {
    const router = Router();
    // Middleware de validation pour vérifier l'unicité du libellé
    const validateLibelleMiddleware = async (req, res, next) => {
        if (req.body && req.body.libelle) {
            if (typeof req.body.libelle !== "string" ||
                req.body.libelle.trim().length < 2) {
                return res
                    .status(400)
                    .json({
                    error: "Le libellé doit être une chaîne d'au moins 2 caractères",
                });
            }
            req.body.libelle = req.body.libelle.trim();
        }
        next();
    };
    router.post("/", validateLibelleMiddleware, controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/:id", controller.getOne.bind(controller));
    router.put("/:id", validateLibelleMiddleware, controller.update.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    return router;
}
