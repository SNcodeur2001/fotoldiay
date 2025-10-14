import { PrismaClient } from "@prisma/client";
export class PrismaService {
    prisma;
    modelName;
    constructor(modelName) {
        this.prisma = new PrismaClient();
        this.modelName = modelName;
    }
    async create(data) {
        return this.prisma[this.modelName].create({ data });
    }
    async findMany(options) {
        return this.prisma[this.modelName].findMany(options);
    }
    async findUnique(where) {
        return this.prisma[this.modelName].findUnique(where);
    }
    async findFirst(params) {
        return this.prisma[this.modelName].findFirst(params);
    }
    async update(where, data) {
        return this.prisma[this.modelName].update({ where, data });
    }
    async delete(where) {
        return this.prisma[this.modelName].delete({ where });
    }
    async count(where) {
        return this.prisma[this.modelName].count({ where });
    }
    async upsert(where, update, create) {
        return this.prisma[this.modelName].upsert({
            where,
            update,
            create,
        });
    }
}
