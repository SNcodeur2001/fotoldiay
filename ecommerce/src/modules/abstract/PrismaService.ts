import { PrismaClient } from "@prisma/client";
import {
  IPrismaService,
  IPrismaServiceCreate,
  IPrismaServiceRead,
} from "./IPrismaService.js";

export class PrismaService<T, TCreate, TUpdate>
  implements IPrismaService<T, TCreate, TUpdate>
{
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = new PrismaClient();
    this.modelName = modelName;
  }

  async create(data: TCreate): Promise<T> {
    return (this.prisma as any)[this.modelName].create({ data });
  }

  async findMany(options?: any): Promise<T[]> {
    return (this.prisma as any)[this.modelName].findMany(options);
  }

  async findUnique(where: any): Promise<T | null> {
    return (this.prisma as any)[this.modelName].findUnique(where);
  }

  async findFirst(params: any): Promise<T | null> {
    return (this.prisma as any)[this.modelName].findFirst(params);
  }

  async update(where: any, data: TUpdate): Promise<T> {
    return (this.prisma as any)[this.modelName].update({ where, data });
  }

  async delete(where: any): Promise<T> {
    return (this.prisma as any)[this.modelName].delete({ where });
  }

  async count(where?: any): Promise<number> {
    return (this.prisma as any)[this.modelName].count({ where });
  }

  async upsert(where: any, update: TUpdate, create: TCreate): Promise<T> {
    return (this.prisma as any)[this.modelName].upsert({
      where,
      update,
      create,
    });
  }
}
