export default class PrismaService {
    model;
    modelName;
    constructor(model, modelName) {
        this.model = model;
        this.modelName = modelName || "";
    }
    /**
     * Recherche avec filtre personnalisé (ex: where, include)
     */
    async findManyWithFilter(args) {
        if (this.modelName === "paiement") {
            // Pour paiement, filtrer via employe.entrepriseId
            const where = args.where || {};
            if (where.entrepriseId) {
                const entrepriseId = where.entrepriseId;
                delete where.entrepriseId;
                where.employe = { entrepriseId };
            }
            return this.model.findMany({
                ...args,
                where,
                include: {
                    employe: {
                        select: {
                            entrepriseId: true,
                            nom: true,
                            prenom: true,
                            matricule: true,
                        },
                    },
                    payslip: {
                        select: { id: true, numero: true },
                    },
                },
            });
        }
        return this.model.findMany(args);
    }
    async create(data) {
        return this.model.create({ data });
    }
    async findAll(options) {
        const { skip, take, search } = options || {};
        if (this.modelName === "paiement") {
            // Inclure l'employé pour exposer entrepriseId au top-level (utile pour filtres frontend)
            const rows = await this.model.findMany({
                where: { deletedAt: null },
                include: {
                    employe: {
                        select: {
                            entrepriseId: true,
                            nom: true,
                            prenom: true,
                            matricule: true,
                        },
                    },
                    payslip: {
                        select: { id: true, numero: true },
                    },
                },
                skip,
                take,
            });
            return rows.map((p) => ({
                ...p,
                entrepriseId: p.employe?.entrepriseId,
            }));
        }
        if (this.modelName === "utilisateur") {
            return this.model.findMany({
                include: {
                    employe: true,
                },
                skip,
                take,
            });
        }
        // Pour les autres modèles (user, product, category)
        const whereClause = {};
        if (search) {
            // Recherche basique par nom/titre selon le modèle
            if (this.modelName === "user") {
                whereClause.OR = [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }
            else if (this.modelName === "product") {
                whereClause.OR = [
                    { title: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ];
            }
            else if (this.modelName === "category") {
                whereClause.OR = [
                    { libelle: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ];
            }
        }
        return this.model.findMany({
            where: whereClause,
            skip,
            take,
            ...(this.modelName === "product" && {
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    category: { select: { id: true, libelle: true } },
                },
            }),
        });
    }
    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.model.update({ where: { id }, data });
    }
    async delete(id) {
        return this.model.delete({ where: { id } });
    }
}
