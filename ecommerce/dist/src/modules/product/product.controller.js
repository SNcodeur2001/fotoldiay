// Product.controller.ts
import { ProductStatus } from "@prisma/client";
import BaseController from "../abstract/BaseController.js";
import { ProductMessages } from "./product.enum.js";
import { z } from "zod";
import prisma from "../../prismaClient.js";
const ProductBaseSchema = {
    title: z.string().min(3, ProductMessages.TITLE_REQUIRED),
    description: z.string().optional(),
    price: z.number().positive(ProductMessages.INVALID_PRICE),
    imageUrl: z.string().url().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    dateExpiration: z.date().optional(),
    viewCount: z.number().int().min(0).optional(),
    isVip: z.boolean().optional(),
    categoryId: z.string().uuid(),
    userId: z.string().uuid(),
};
export class ProductController extends BaseController {
    service;
    createSchema = z.object(ProductBaseSchema);
    updateSchema = z
        .object({
        id: z.string().uuid().optional(),
    })
        .merge(z.object(ProductBaseSchema).partial());
    constructor(service) {
        super();
        this.service = service;
    }
    // Approve product (moderator only)
    approveProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.update({
                where: { id },
                data: {
                    status: ProductStatus.VALIDE,
                    dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                }
            });
            res.status(200).json({
                data: product,
                message: ProductMessages.VALIDATED_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Reject product (moderator only)
    rejectProduct = async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await prisma.product.update({
                where: { id },
                data: { status: ProductStatus.SUPPRIME }
            });
            res.status(200).json({
                data: product,
                message: ProductMessages.REJECTED_SUCCESS
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Set VIP status (admin only)
    setVipStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { isVip } = req.body;
            const product = await prisma.product.update({
                where: { id },
                data: { isVip: Boolean(isVip) }
            });
            res.status(200).json({
                data: product,
                message: `Statut VIP ${isVip ? 'activé' : 'désactivé'} avec succès`
            });
        }
        catch (err) {
            next(err);
        }
    };
    // Cleanup expired products (scheduler method)
    cleanupExpiredProducts = async () => {
        try {
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
        catch (error) {
            console.error('Error cleaning up expired products:', error);
            throw error;
        }
    };
    // Delete old expired products (scheduler method)
    deleteOldExpiredProducts = async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await prisma.product.deleteMany({
                where: {
                    status: ProductStatus.EXPIRE,
                    updatedAt: {
                        lt: thirtyDaysAgo
                    }
                }
            });
            return result.count;
        }
        catch (error) {
            console.error('Error deleting old expired products:', error);
            throw error;
        }
    };
}
