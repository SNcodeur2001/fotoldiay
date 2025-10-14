import { Router } from "express";
import { hashPassword } from "./auth/hashPassword.js";
import validateUserUniqueness from "./middleware/validateUserUniqueness.js";
export default function buildUtilisateurRoute(controller) {
    const router = Router();
    // Middleware pour hasher le mot de passe
    const hashPasswordMiddleware = async (req, res, next) => {
        if (req.body && req.body.password) {
            try {
                req.body.password = await hashPassword(req.body.password);
            }
            catch (err) {
                return res
                    .status(500)
                    .json({ error: "Erreur lors du hash du mot de passe" });
            }
        }
        next();
    };
    // Routes avec validation d'unicité
    router.post("/", validateUserUniqueness, hashPasswordMiddleware, controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/:id", controller.getOne.bind(controller));
    router.put("/:id", validateUserUniqueness, hashPasswordMiddleware, controller.update.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    return router;
}
