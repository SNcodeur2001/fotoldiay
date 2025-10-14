export class BaseController {
    // CRUD methods
    create = async (req, res, next) => {
        try {
            const validatedData = this.createSchema.parse(req.body);
            const entity = await this.service.create(validatedData);
            res.status(201).json({
                data: this.formatEntity(entity),
                message: this.getCreationMessage()
            });
        }
        catch (err) {
            next(err);
        }
    };
    getAll = async (req, res, next) => {
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
        }
        catch (err) {
            next(err);
        }
    };
    getOne = async (req, res, next) => {
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
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const validatedData = this.updateSchema.parse({ ...req.body, id });
            const entity = await this.service.update({ id }, validatedData);
            res.status(200).json({
                data: this.formatEntity(entity),
                message: this.getUpdateMessage()
            });
        }
        catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.service.delete({ id });
            res.status(200).json({
                message: this.getDeleteMessage()
            });
        }
        catch (err) {
            next(err);
        }
    };
}
