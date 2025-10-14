import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { UserController } from "../utilisateur.controller.js";
import { PrismaService } from "../../abstract/PrismaService.js";
const router = Router();
// Initialize services
const prismaService = new PrismaService('user');
const userController = new UserController(prismaService);
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
    console.log('authenticateToken called for:', req.path);
    const authHeader = req.headers['authorization'];
    console.log('authHeader:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token:', token ? 'present' : 'missing');
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Token manquant' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ error: 'Token invalide' });
        }
        console.log('Token verified, user:', user);
        req.user = user;
        next();
    });
};
// Optional middleware to verify JWT token (doesn't fail if no token)
export const optionalAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
            next();
        });
    }
    else {
        next();
    }
};
// Login route
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ error: 'Email/téléphone et mot de passe requis' });
        }
        // Find user by email or phone
        const prisma = new PrismaClient();
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: login },
                    { telephone: login }
                ]
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            token,
            message: 'Connexion réussie'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, telephone, adresse, role } = req.body;
        if (!name || !email || !password || !telephone) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }
        // Check if user already exists
        const prisma = new PrismaClient();
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { telephone }
                ]
            }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Utilisateur déjà existant' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                telephone,
                adresse: adresse || '',
                role: role || 'VENDEUR'
            }
        });
        // Generate JWT token
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            user: userWithoutPassword,
            token,
            message: 'Inscription réussie'
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// Get current user (me) route
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // Use direct Prisma query instead of the service
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// Logout route
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side by removing the token
        // We can optionally implement token blacklisting here if needed
        res.json({ message: 'Déconnexion réussie' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
export default router;
