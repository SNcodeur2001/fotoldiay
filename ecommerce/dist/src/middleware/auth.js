import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token d\'accès requis' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        // Vérifier que l'utilisateur existe toujours
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};
// Middleware pour vérifier les rôles
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification requise' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Permissions insuffisantes',
                requiredRoles: roles,
                currentRole: req.user.role
            });
        }
        next();
    };
};
