import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";
import { CategoryRepository } from "./category.repository.js";

const router = Router();

// Instanciation des dépendances
const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

// Routes
router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getOne.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
