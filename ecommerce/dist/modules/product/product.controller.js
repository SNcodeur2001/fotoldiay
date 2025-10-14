import { ProductStatus } from "@prisma/client";
import { BaseController } from "../abstract/BaseController.js";
import { ProductMessages } from "./product.enum.js";
import { z } from "zod";
const ProductBaseSchema = {
    title: z.string().min(3, ProductMessages.TITLE_REQUIRED),
    description: z.string().optional(),
    price: z.number().positive(ProductMessages.INVALID_PRICE),
    imageUrl: z.string().url().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    dateExpiration: z.date().optional(),
    viewCount: z.number().int().min(0).optional(),
    isVip: z.boolean().optional(),
    categoryId: z.string().uuid(),
    userId: z.string().uuid(),
};
export class ProductController extends BaseController {
    service;
    createSchema = z.object(ProductBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
    })
        .merge(z.object(ProductBaseSchema).partial());
    constructor(service) {
        super();
        this.service = service;
    }
    getCreationMessage() {
        return ProductMessages.CREATION_SUCCESS;
    }
    getListMessage() {
        return ProductMessages.LIST_SUCCESS;
    }
    getDetailMessage() {
        return ProductMessages.DETAIL_SUCCESS;
    }
    getUpdateMessage() {
        return ProductMessages.UPDATE_SUCCESS;
    }
    getDeleteMessage() {
        return ProductMessages.DELETE_SUCCESS;
    }
    getNotFoundMessage() {
        return ProductMessages.NOT_FOUND;
    }
    formatEntity(entity) {
        return entity;
    }
    formatEntities(entities) {
        return entities.map(entity => this.formatEntity(entity));
    }
    // Override getOne pour utiliser findById du service
    getOne = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entity = await this.service.findById(id);
            if (!entity) {
                return res.status(404).json({ error: this.getNotFoundMessage() });
            }
            res.status(200).json({
                data: this.formatEntity(entity),
                message: this.getDetailMessage()
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Override getAll pour supporter les filtres avancés
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const search = req.query.search || undefined;
            const categoryId = req.query.categoryId || undefined;
            let status = req.query.status || undefined;
            const isVip = req.query.isVip ? req.query.isVip === 'true' : undefined;
            const userId = req.query.userId || undefined;
            // Pour les visiteurs non connectés, forcer l'affichage des produits validés uniquement
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                status = ProductStatus.VALIDE;
            }
            const result = await this.service.findAll({
                page,
                limit,
                search,
                categoryId,
                status,
                isVip,
                userId
            });
            res.status(200).json({
                page: result.page,
                limit: result.limit,
                total: result.total,
                data: this.formatEntities(result.data),
                message: ProductMessages.LIST_SUCCESS,
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Méthodes de modération
    approveProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await this.service.approveProduct(id);
            res.status(200).json({
                data: this.formatEntity(product),
                message: ProductMessages.VALIDATED_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    };
    rejectProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await this.service.rejectProduct(id);
            res.status(200).json({
                data: this.formatEntity(product),
                message: ProductMessages.REJECTED_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    };
    setVipStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { isVip } = req.body;
            const product = await this.service.setVipStatus(id, Boolean(isVip));
            res.status(200).json({
                data: this.formatEntity(product),
                message: `Statut VIP ${isVip ? 'activé' : 'désactivé'} avec succès`
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Méthodes pour les vendeurs
    getMyProducts = async (req, res, next) => {
        try {
            const userId = req.params.userId || req.user?.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status || undefined;
            const result = await this.service.findByUserId(userId, { page, limit, status });
            res.status(200).json({
                page,
                limit,
                total: result.total,
                data: this.formatEntities(result.data),
                message: "Mes produits récupérés avec succès"
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Méthodes utilitaires pour les tâches planifiées
    cleanupExpiredProducts = async () => {
        return await this.service.cleanupExpiredProducts();
    };
    deleteOldExpiredProducts = async () => {
        return await this.service.deleteOldExpiredProducts();
    };
}
