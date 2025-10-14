import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { validateUser } from "./validateUser.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "./cookies.js";
import { hashPassword } from "./hashPassword.js";
import validateUserUniqueness from "../middleware/validateUserUniqueness.js";
const prisma = new PrismaClient();
const router = Router();
// === CONFIGURATION JWT ===
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";
const JWT_ALGO = "HS256";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";
// === GÉNÉRATION DES TOKENS ===
function generateToken(payload, type) {
    const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
    const expiresIn = type === "access" ? ACCESS_TOKEN_EXPIRES : REFRESH_TOKEN_EXPIRES;
    return jwt.sign(payload, secret, {
        algorithm: JWT_ALGO,
        expiresIn,
    });
}
// === EXTRACTION DU PAYLOAD DU REFRESH TOKEN ===
function extractPayloadFromRefreshToken(token) {
    try {
        const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
            algorithms: [JWT_ALGO],
        });
        return { email: payload.email };
    }
    catch {
        return null;
    }
}
// === LOGIN ===
router.post("/login", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password)
            return res.status(400).json({ error: "Login et mot de passe requis" });
        const user = await validateUser(login, password);
        if (!user)
            return res.status(401).json({ error: "Identifiants invalides" });
        const accessPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const refreshPayload = { email: user.email };
        const accessToken = generateToken(accessPayload, "access");
        const refreshToken = generateToken(refreshPayload, "refresh");
        setRefreshTokenCookie(res, refreshToken);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        return res.json({
            message: "Connexion réussie",
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Erreur lors du login :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});
// === RAFRAÎCHIR LE TOKEN D’ACCÈS ===
router.post("/refresh", async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token)
        return res.status(401).json({ error: "Token manquant" });
    const payload = extractPayloadFromRefreshToken(token);
    if (!payload?.email)
        return res.status(401).json({ error: "Token invalide" });
    try {
        const user = await prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (!user)
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        const accessPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        const accessToken = generateToken(accessPayload, "access");
        return res.json({ accessToken });
    }
    catch (error) {
        console.error("Erreur lors du refresh :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});
// === LOGOUT ===
router.post("/logout", (req, res) => {
    clearRefreshTokenCookie(res);
    return res.json({ message: "Déconnexion réussie" });
});
// === REGISTER ===
router.post("/register", validateUserUniqueness, async (req, res) => {
    try {
        const { name, email, password, telephone, adresse, role = 'VISITEUR' } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nom, email et mot de passe requis" });
        }
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                telephone,
                adresse,
                role,
            },
        });
        // Generate tokens
        const accessPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const refreshPayload = { email: user.email };
        const accessToken = generateToken(accessPayload, "access");
        const refreshToken = generateToken(refreshPayload, "refresh");
        setRefreshTokenCookie(res, refreshToken);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        return res.status(201).json({
            message: "Inscription réussie",
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});
// === GET CURRENT USER ===
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
        if (!token)
            return res.status(401).json({ error: "Token manquant" });
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGO] });
        if (!payload.userId)
            return res.status(401).json({ error: "Token invalide" });
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, name: true, email: true, telephone: true, adresse: true, role: true, createdAt: true, updatedAt: true },
        });
        if (!user)
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        return res.json(user);
    }
    catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});
export default router;
