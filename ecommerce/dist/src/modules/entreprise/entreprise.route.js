import { Router } from "express";
// import { entrepriseAuthMiddleware } from "../abstract/entrepriseAuthMiddleware.js";
export default function bulidEntrepriseRoute(controller) {
    const router = Router();
    router.post("/", controller.create.bind(controller));
    router.get("/", controller.getAll.bind(controller));
    router.get("/:id", controller.getOne.bind(controller));
    router.put("/:id", controller.update.bind(controller));
    router.delete("/:id", controller.delete.bind(controller));
    return router;
}
