import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { IPrismaService } from "./IPrismaService.js";

export abstract class BaseController<T, TCreate, TUpdate> {
  protected abstract service: any;
  protected abstract createSchema: z.ZodType<Omit<TCreate, "id" | "createdAt" | "updatedAt">>;
  protected abstract updateSchema: z.ZodType<TUpdate>;

  // Abstract methods for custom messages
  protected abstract getCreationMessage(): string;
  protected abstract getListMessage(): string;
  protected abstract getDetailMessage(): string;
  protected abstract getUpdateMessage(): string;
  protected abstract getDeleteMessage(): string;
  protected abstract getNotFoundMessage(): string;

  // Abstract methods for custom formatting
  protected abstract formatEntity(entity: T): any;
  protected abstract formatEntities(entities: T[]): any[];

  // CRUD methods
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = this.createSchema.parse(req.body);
      const entity = await this.service.create(validatedData as any);
      res.status(201).json({
        data: this.formatEntity(entity),
        message: this.getCreationMessage()
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [entities, total] = await Promise.all([
        this.service.findMany({
          where: filters,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        this.service.count({ where: filters })
      ]);

      res.status(200).json({
        data: this.formatEntities(entities),
        page: Number(page),
        limit: Number(limit),
        count: total,
        message: this.getListMessage()
      });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const entity = await this.service.findUnique({ id });

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

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = this.updateSchema.parse({ ...req.body, id });

      const entity = await this.service.update({ id }, validatedData);

      res.status(200).json({
        data: this.formatEntity(entity),
        message: this.getUpdateMessage()
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.delete({ id });

      res.status(200).json({
        message: this.getDeleteMessage()
      });
    } catch (err) {
      next(err);
    }
  };
}
