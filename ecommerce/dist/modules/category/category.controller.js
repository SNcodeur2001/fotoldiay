import { BaseController } from "../abstract/BaseController.js";
import { CategoryMessages } from "./category.enum.js";
import { z } from "zod";
const CategoryBaseSchema = {
    libelle: z.string().min(2, CategoryMessages.LIBELLE_REQUIRED),
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
    getCreationMessage() {
        return CategoryMessages.CREATION_SUCCESS;
    }
    getListMessage() {
        return CategoryMessages.LIST_SUCCESS;
    }
    getDetailMessage() {
        return CategoryMessages.DETAIL_SUCCESS;
    }
    getUpdateMessage() {
        return CategoryMessages.UPDATE_SUCCESS;
    }
    getDeleteMessage() {
        return CategoryMessages.DELETE_SUCCESS;
    }
    getNotFoundMessage() {
        return CategoryMessages.NOT_FOUND;
    }
    formatEntity(entity) {
        return entity;
    }
    formatEntities(entities) {
        return entities;
    }
    // Override getAll pour supporter la recherche
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || undefined;
            const result = await this.service.findAll({ page, limit, search });
            res.status(200).json({
                page: result.page,
                limit: result.limit,
                total: result.total,
                data: result.data,
                message: CategoryMessages.LIST_SUCCESS,
            });
        }
        catch (err) {
            next(err);
        }
    };
}
