import BaseController from "../abstract/BaseController.js";
import { CategoryMessages, CategoryValidationRules } from "./category.enum.js";
import { z } from "zod";
const CategoryBaseSchema = {
    libelle: z
        .string()
        .min(CategoryValidationRules.MIN_LIBELLE_LENGTH, CategoryMessages.LIBELLE_REQUIRED),
    description: z.string().nullable().optional(),
};
export class CategoryController extends BaseController {
    service;
    createSchema = z.object(CategoryBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
    })
        .merge(z.object(CategoryBaseSchema).partial());
    constructor(service) {
        super();
        this.service = service;
    }
    // Surcharger les méthodes pour utiliser les messages personnalisés
    async create(req, res, next) {
        try {
            const data = this.createSchema?.parse(req.body) ?? req.body;
            const entity = await this.service.create(data);
            res
                .status(201)
                .json({ message: CategoryMessages.CREATION_SUCCESS, entity });
        }
        catch (err) {
            next(err);
        }
    }
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search || undefined;
            let entities = await this.service.findAll({ skip, take: limit, search });
            res.status(200).json({
                page,
                limit,
                count: entities.length,
                data: entities,
                message: CategoryMessages.LIST_SUCCESS,
            });
        }
        catch (err) {
            next(err);
        }
    };
    getOne = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entity = await this.service.findById(id);
            if (!entity)
                return res.status(404).json({ error: CategoryMessages.NOT_FOUND });
            res
                .status(200)
                .json({ data: entity, message: CategoryMessages.DETAIL_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = this.updateSchema?.parse(req.body) ?? req.body;
            const entity = await this.service.update(id, data);
            if (!entity)
                return res.status(404).json({ error: CategoryMessages.NOT_FOUND });
            res
                .status(200)
                .json({ data: entity, message: CategoryMessages.UPDATE_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            res.status(204).json({ message: CategoryMessages.DELETE_SUCCESS });
        }
        catch (err) {
            next(err);
        }
    };
}
