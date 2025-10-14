import { Router } from "express";
export default function buildProductRoute(controller) {
    const router = Router();
    // Middleware de validation pour les prix (s'assurer qu'ils sont positifs)
    const validatePriceMiddleware = async (req, res, next) => {
        if (req.body && req.body.price) {
            const price = parseFloat(req.body.price);
            if (isNaN(price) || price <= 0) {
                return res
                    .status(400)
                    .json({ error: "Le prix doit être un nombre positif" });
            }
            req.body.price = price;
        }
        next();
    };
    router.post("/", validatePriceMiddleware, controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/:id", controller.getOne.bind(controller));
    router.put("/:id", validatePriceMiddleware, controller.update.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    // Moderator routes
    router.put("/:id/approve", controller.approveProduct.bind(controller));
    router.put("/:id/reject", controller.rejectProduct.bind(controller));
    router.put("/:id/vip", controller.setVipStatus.bind(controller));
    return router;
}
