import { Product, ProductStatus } from "@prisma/client";
import { BaseController } from "../abstract/BaseController.js";
import { ProductService } from "./product.service.js";
import { ProductRepository } from "./product.repository.js";
import { CreateProductDto, UpdateProductDto } from "./product.dto.js";
import { ProductMessages } from "./product.enum.js";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

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

export class ProductController extends BaseController<Product, CreateProductDto, UpdateProductDto> {
  protected service: ProductService;
  protected createSchema = z.object(ProductBaseSchema) as z.ZodType<
    Omit<CreateProductDto, "id" | "createdAt" | "updatedAt">
  >;

  protected updateSchema = z
    .object({
      id: z.string().uuid().optional(),
    })
    .merge(
      z.object(ProductBaseSchema).partial()
    ) as z.ZodType<UpdateProductDto>;

  constructor(service: ProductService) {
    super();
    this.service = service;
  }

  protected getCreationMessage(): string {
    return ProductMessages.CREATION_SUCCESS;
  }

  protected getListMessage(): string {
    return ProductMessages.LIST_SUCCESS;
  }

  protected getDetailMessage(): string {
    return ProductMessages.DETAIL_SUCCESS;
  }

  protected getUpdateMessage(): string {
    return ProductMessages.UPDATE_SUCCESS;
  }

  protected getDeleteMessage(): string {
    return ProductMessages.DELETE_SUCCESS;
  }

  protected getNotFoundMessage(): string {
    return ProductMessages.NOT_FOUND;
  }

  protected formatEntity(entity: Product): any {
    return entity;
  }

  protected formatEntities(entities: Product[]): any[] {
    return entities.map(entity => this.formatEntity(entity));
  }

  // Override getOne pour utiliser findById du service
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const entity = await (this.service as ProductService).findById(id);

      if (!entity) {
        return res.status(404).json({ error: this.getNotFoundMessage() });
      }

      res.status(200).json({
        data: this.formatEntity(entity),
        message: this.getDetailMessage()
      });
    } catch (err) {
      next(err);
    }
  };

  // Override getAll pour supporter les filtres avancés
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const search = (req.query.search as string) || undefined;
      const categoryId = (req.query.categoryId as string) || undefined;
      const status = (req.query.status as string) as ProductStatus || undefined;
      const isVip = req.query.isVip ? req.query.isVip === 'true' : undefined;
      const userId = (req.query.userId as string) || undefined;

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
    } catch (err) {
      next(err);
    }
  };

  // Méthodes de modération
  approveProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await (this.service as ProductService).approveProduct(id);

      res.status(200).json({
        data: this.formatEntity(product),
        message: ProductMessages.VALIDATED_SUCCESS
      });
    } catch (err) {
      next(err);
    }
  };

  rejectProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await (this.service as ProductService).rejectProduct(id);

      res.status(200).json({
        data: this.formatEntity(product),
        message: ProductMessages.REJECTED_SUCCESS
      });
    } catch (err) {
      next(err);
    }
  };

  setVipStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isVip } = req.body;

      const product = await (this.service as ProductService).setVipStatus(id, Boolean(isVip));

      res.status(200).json({
        data: this.formatEntity(product),
        message: `Statut VIP ${isVip ? 'activé' : 'désactivé'} avec succès`
      });
    } catch (err) {
      next(err);
    }
  };

  // Méthodes pour les vendeurs
  getMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId || (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = (req.query.status as string) as ProductStatus || undefined;

      const result = await (this.service as ProductService).findByUserId(userId, { page, limit, status });

      res.status(200).json({
        page,
        limit,
        total: result.total,
        data: this.formatEntities(result.data),
        message: "Mes produits récupérés avec succès"
      });
    } catch (err) {
      next(err);
    }
  };

  // Méthodes utilitaires pour les tâches planifiées
  cleanupExpiredProducts = async (): Promise<number> => {
    return await this.service.cleanupExpiredProducts();
  };

  deleteOldExpiredProducts = async (): Promise<number> => {
    return await this.service.deleteOldExpiredProducts();
  };
}
