import { Product, ProductStatus } from "@prisma/client";
import { IPrismaService } from "../abstract/IPrismaService.js";
import prisma from "../../prismaClient.js";

export class ProductRepository implements IPrismaService<Product, Omit<Product, "id" | "createdAt" | "updatedAt">, Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>> {
  async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    return await prisma.product.create({ data });
  }

  async findMany(options?: any): Promise<Product[]> {
    return await prisma.product.findMany(options);
  }

  async findUnique(where: any): Promise<Product | null> {
    return await prisma.product.findUnique(where);
  }

  async findFirst(where: any): Promise<Product | null> {
    return await prisma.product.findFirst(where);
  }

  async update(where: any, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product> {
    return await prisma.product.update({ where, data });
  }

  async delete(where: any): Promise<Product> {
    return await prisma.product.delete(where);
  }

  async upsert(where: any, update: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>, create: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    return await prisma.product.upsert({ where, update, create });
  }

  async count(where?: any): Promise<number> {
    return await prisma.product.count(where);
  }

  // Méthodes spécifiques aux produits
  async incrementViewCount(id: string): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });
  }

  async findExpiredProducts(): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        status: ProductStatus.VALIDE,
        dateExpiration: {
          lt: new Date()
        }
      }
    });
  }

  async expireProducts(): Promise<number> {
    const result = await prisma.product.updateMany({
      where: {
        status: ProductStatus.VALIDE,
        dateExpiration: {
          lt: new Date()
        }
      },
      data: {
        status: ProductStatus.EXPIRE
      }
    });
    return result.count;
  }

  async deleteOldExpiredProducts(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.product.deleteMany({
      where: {
        status: ProductStatus.EXPIRE,
        updatedAt: {
          lt: cutoffDate
        }
      }
    });
    return result.count;
  }

  async findByUserId(userId: string, options?: { skip?: number; take?: number; status?: ProductStatus }): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        userId,
        ...(options?.status && { status: options.status })
      },
      skip: options?.skip,
      take: options?.take,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true
      }
    });
  }

  async countByUserId(userId: string, status?: ProductStatus): Promise<number> {
    return await prisma.product.count({
      where: {
        userId,
        ...(status && { status })
      }
    });
  }
}
