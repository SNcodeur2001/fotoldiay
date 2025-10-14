import { BaseMessages } from "./abstract.enum.js";
export default class BaseController {
    // Méthode pour permettre aux classes enfants de formatter les entités
    formatEntity(entity) {
        return entity;
    }
    // Méthode pour permettre aux classes enfants de formatter les listes
    formatEntities(entities) {
        return entities.map((entity) => this.formatEntity(entity));
    }
    // Méthodes pour permettre aux classes enfants de personnaliser les messages
    getCreationMessage() {
        return BaseMessages.CREATION_SUCCESS;
    }
    getListMessage() {
        return BaseMessages.LIST_SUCCESS;
    }
    getDetailMessage() {
        return BaseMessages.DETAIL_SUCCESS;
    }
    getUpdateMessage() {
        return BaseMessages.UPDATE_SUCCESS;
    }
    getDeleteMessage() {
        return BaseMessages.DELETE_SUCCESS;
    }
    getNotFoundMessage() {
        return BaseMessages.NOT_FOUND;
    }
    async create(req, res, next) {
        try {
            const data = this.createSchema?.parse(req.body) ?? req.body;
            const entity = await this.service.create(data);
            res.status(201).json({
                message: this.getCreationMessage(),
                entity: this.formatEntity(entity),
            });
        }
        catch (err) {
            next(err);
        }
    }
    // --- GET ALL avec pagination ---
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const search = req.query.search || undefined;
            let entities = await this.service.findAll({ skip, take: limit, search });
            // --- Filtrage entreprise si applicable ---
            const entrepriseId = req.user?.entrepriseId;
            if (entrepriseId && entities.length) {
                const first = entities[0];
                if ("entrepriseId" in first) {
                    entities = entities.filter((e) => e.entrepriseId === entrepriseId);
                }
                else if ("clientId" in first) {
                    entities = entities.filter((e) => e.client?.entrepriseId === entrepriseId);
                }
            }
            res.status(200).json({
                page,
                limit,
                count: entities.length,
                data: this.formatEntities(entities),
                message: this.getListMessage(),
            });
        }
        catch (err) {
            next(err);
        }
    };
    getOne = async (req, res, next) => {
        try {
            const { id } = req.params;
            const entity = await this.service.findById(id);
            if (!entity)
                return res.status(404).json({ error: this.getNotFoundMessage() });
            res
                .status(200)
                .json({
                data: this.formatEntity(entity),
                message: this.getDetailMessage(),
            });
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = this.updateSchema?.parse(req.body) ?? req.body;
            const entity = await this.service.update(id, data);
            if (!entity)
                return res.status(404).json({ error: this.getNotFoundMessage() });
            res
                .status(200)
                .json({
                data: this.formatEntity(entity),
                message: this.getUpdateMessage(),
            });
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            res.status(204).json({ message: this.getDeleteMessage() });
        }
        catch (err) {
            next(err);
        }
    };
}
