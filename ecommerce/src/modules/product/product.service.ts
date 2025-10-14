import { Product, ProductStatus } from "@prisma/client";
import { ProductRepository } from "./product.repository.js";
import { CreateProductDto, UpdateProductDto } from "./product.dto.js";
import { ProductMessages } from "./product.enum.js";

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async create(data: CreateProductDto): Promise<Product> {
    // Validation des règles métier
    if (data.price <= 0) {
      throw new Error(ProductMessages.INVALID_PRICE);
    }

    if (data.title.length < 3) {
      throw new Error(ProductMessages.TITLE_REQUIRED);
    }

    // Vérifier que la catégorie existe
    // TODO: Injecter CategoryService pour validation

    // Définir le statut par défaut
    const productData = {
      ...data,
      status: data.status || ProductStatus.EN_ATTENTE,
      viewCount: data.viewCount || 0,
      isVip: data.isVip || false,
      dateExpiration: data.dateExpiration || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 jours par défaut
    };

    return await this.repository.create(productData);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    status?: ProductStatus;
    isVip?: boolean;
    userId?: string;
  }): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 12, search, categoryId, status, isVip, userId } = options || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (isVip !== undefined) {
      where.isVip = isVip;
    }

    if (userId) {
      where.userId = userId;
    }

    const [data, total] = await Promise.all([
      this.repository.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isVip: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      this.repository.count({ where })
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            telephone: true
          }
        }
      }
    });

    if (product) {
      // Incrémenter le compteur de vues
      await this.repository.incrementViewCount(id);
      product.viewCount += 1;
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    // Vérifier que le produit existe
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error(ProductMessages.NOT_FOUND);
    }

    // Vérifier les permissions (seul le propriétaire peut modifier)
    // TODO: Ajouter vérification d'autorisation

    // Validation des règles métier
    if (data.price !== undefined && data.price <= 0) {
      throw new Error(ProductMessages.INVALID_PRICE);
    }

    if (data.title && data.title.length < 3) {
      throw new Error(ProductMessages.TITLE_REQUIRED);
    }

    return await this.repository.update({ id }, data);
  }

  async delete(id: string): Promise<Product> {
    // Vérifier que le produit existe
    const existingProduct = await this.findById(id);
    if (!existingProduct) {
      throw new Error(ProductMessages.NOT_FOUND);
    }

    // Vérifier les permissions
    // TODO: Ajouter vérification d'autorisation

    return await this.repository.delete({ where: { id } });
  }

  // Méthodes de modération
  async approveProduct(id: string): Promise<Product> {
    const product = await this.repository.update(
      { id },
      {
        status: ProductStatus.VALIDE,
        dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      }
    );
    return product;
  }

  async rejectProduct(id: string): Promise<Product> {
    return await this.repository.update({ id }, { status: ProductStatus.SUPPRIME });
  }

  async setVipStatus(id: string, isVip: boolean): Promise<Product> {
    return await this.repository.update({ id }, { isVip });
  }

  // Méthodes utilitaires pour les tâches planifiées
  async cleanupExpiredProducts(): Promise<number> {
    return await this.repository.expireProducts();
  }

  async deleteOldExpiredProducts(): Promise<number> {
    return await this.repository.deleteOldExpiredProducts();
  }

  // Méthodes pour les vendeurs
  async findByUserId(userId: string, options?: { page?: number; limit?: number; status?: ProductStatus }): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10, status } = options || {};
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.findByUserId(userId, { skip, take: limit, status }),
      this.repository.countByUserId(userId, status)
    ]);

    return { data, total };
  }
}
