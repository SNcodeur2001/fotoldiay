import { ProductStatus } from "@prisma/client";
import prisma from "../../prismaClient.js";
export class ProductRepository {
    async create(data) {
        return await prisma.product.create({ data });
    }
    async findMany(options) {
        return await prisma.product.findMany(options);
    }
    async findUnique(where) {
        return await prisma.product.findUnique(where);
    }
    async findFirst(where) {
        return await prisma.product.findFirst(where);
    }
    async update(where, data) {
        return await prisma.product.update({ where, data });
    }
    async delete(where) {
        return await prisma.product.delete(where);
    }
    async upsert(where, update, create) {
        return await prisma.product.upsert({ where, update, create });
    }
    async count(where) {
        return await prisma.product.count(where);
    }
    // Méthodes spécifiques aux produits
    async incrementViewCount(id) {
        return await prisma.product.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        });
    }
    async findExpiredProducts() {
        return await prisma.product.findMany({
            where: {
                status: ProductStatus.VALIDE,
                dateExpiration: {
                    lt: new Date()
                }
            }
        });
    }
    async expireProducts() {
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
    async deleteOldExpiredProducts(daysOld = 30) {
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
    async findByUserId(userId, options) {
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
    async countByUserId(userId, status) {
        return await prisma.product.count({
            where: {
                userId,
                ...(status && { status })
            }
        });
    }
}
