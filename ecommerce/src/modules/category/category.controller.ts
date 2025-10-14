import { Category } from "@prisma/client";
import { BaseController } from "../abstract/BaseController.js";
import { CategoryService } from "./category.service.js";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";
import { CategoryMessages } from "./category.enum.js";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const CategoryBaseSchema = {
  libelle: z.string().min(2, CategoryMessages.LIBELLE_REQUIRED),
  description: z.string().nullable().optional(),
};

export class CategoryController extends BaseController<Category, CreateCategoryDto, UpdateCategoryDto> {
  protected service: CategoryService;
  protected createSchema = z.object(CategoryBaseSchema) as z.ZodType<
    Omit<CreateCategoryDto, "id" | "createdAt" | "updatedAt">
  >;

  protected updateSchema = z
    .object({
      id: z.string().uuid().optional(),
    })
    .merge(
      z.object(CategoryBaseSchema).partial()
    ) as z.ZodType<UpdateCategoryDto>;

  constructor(service: CategoryService) {
    super();
    this.service = service;
  }

  protected getCreationMessage(): string {
    return CategoryMessages.CREATION_SUCCESS;
  }

  protected getListMessage(): string {
    return CategoryMessages.LIST_SUCCESS;
  }

  protected getDetailMessage(): string {
    return CategoryMessages.DETAIL_SUCCESS;
  }

  protected getUpdateMessage(): string {
    return CategoryMessages.UPDATE_SUCCESS;
  }

  protected getDeleteMessage(): string {
    return CategoryMessages.DELETE_SUCCESS;
  }

  protected getNotFoundMessage(): string {
    return CategoryMessages.NOT_FOUND;
  }

  protected formatEntity(entity: Category): any {
    return entity;
  }

  protected formatEntities(entities: Category[]): any[] {
    return entities;
  }

  // Override getAll pour supporter la recherche
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || undefined;

      const result = await this.service.findAll({ page, limit, search });

      res.status(200).json({
        page: result.page,
        limit: result.limit,
        total: result.total,
        data: result.data,
        message: CategoryMessages.LIST_SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  };
}
