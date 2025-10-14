import { CategoryMessages } from "./category.enum.js";
export class CategoryService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        // Vérifier l'unicité du libellé
        const existingCategory = await this.repository.findFirst({
            where: { libelle: data.libelle }
        });
        if (existingCategory) {
            throw new Error(CategoryMessages.LIBELLE_ALREADY_EXISTS);
        }
        return await this.repository.create(data);
    }
    async findAll(options) {
        const { page = 1, limit = 10, search } = options || {};
        const skip = (page - 1) * limit;
        const where = search ? {
            OR: [
                { libelle: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        } : undefined;
        const [data, total] = await Promise.all([
            this.repository.findMany({ where, skip, take: limit }),
            this.repository.count({ where })
        ]);
        return { data, total, page, limit };
    }
    async findById(id) {
        return await this.repository.findUnique({ where: { id } });
    }
    async update(id, data) {
        // Vérifier que la catégorie existe
        const existingCategory = await this.findById(id);
        if (!existingCategory) {
            throw new Error(CategoryMessages.NOT_FOUND);
        }
        // Vérifier l'unicité du libellé si modifié
        if (data.libelle && data.libelle !== existingCategory.libelle) {
            const duplicateCategory = await this.repository.findFirst({
                where: { libelle: data.libelle }
            });
            if (duplicateCategory) {
                throw new Error(CategoryMessages.LIBELLE_ALREADY_EXISTS);
            }
        }
        return await this.repository.update({ id }, data);
    }
    async delete(id) {
        // Vérifier que la catégorie existe
        const existingCategory = await this.findById(id);
        if (!existingCategory) {
            throw new Error(CategoryMessages.NOT_FOUND);
        }
        // TODO: Vérifier si la catégorie est utilisée par des produits
        // Pour l'instant, on permet la suppression
        return await this.repository.delete({ where: { id } });
    }
}
