import { Category } from "@prisma/client";
import { IPrismaService } from "../abstract/IPrismaService.js";
import prisma from "../../prismaClient.js";

export class CategoryRepository implements IPrismaService<Category, Omit<Category, "id" | "createdAt" | "updatedAt">, Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>> {
  async create(data: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    return await prisma.category.create({ data });
  }

  async findMany(options?: any): Promise<Category[]> {
    return await prisma.category.findMany(options);
  }

  async findUnique(where: any): Promise<Category | null> {
    return await prisma.category.findUnique(where);
  }

  async findFirst(where: any): Promise<Category | null> {
    return await prisma.category.findFirst(where);
  }

  async update(where: any, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>): Promise<Category> {
    return await prisma.category.update({ where, data });
  }

  async delete(where: any): Promise<Category> {
    return await prisma.category.delete(where);
  }

  async upsert(where: any, update: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>, create: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<Category> {
    return await prisma.category.upsert({ where, update, create });
  }

  async count(where?: any): Promise<number> {
    return await prisma.category.count(where);
  }
}
