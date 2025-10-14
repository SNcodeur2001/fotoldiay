import prisma from "../../prismaClient.js";
export class CategoryRepository {
    async create(data) {
        return await prisma.category.create({ data });
    }
    async findMany(options) {
        return await prisma.category.findMany(options);
    }
    async findUnique(where) {
        return await prisma.category.findUnique(where);
    }
    async findFirst(where) {
        return await prisma.category.findFirst(where);
    }
    async update(where, data) {
        return await prisma.category.update({ where, data });
    }
    async delete(where) {
        return await prisma.category.delete(where);
    }
    async upsert(where, update, create) {
        return await prisma.category.upsert({ where, update, create });
    }
    async count(where) {
        return await prisma.category.count(where);
    }
}
