import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import indexRoutes from "./modules/index.routes.js";
import { scheduleWeeklyCleanup } from "./scheduler.js";
dotenv.config();
const app = express();
// app.use(
//   cors()
// );
app.use(cors({
    origin: function (origin, callback) {
        // Autorisations explicites + ports dynamiques 517x
        const allowedOrigins = [
            process.env.URL_FRONTEND || "",
            "http://localhost",
            "http://127.0.0.1",
            "http://localhost:4200",
        ].filter(Boolean);
        // Autoriser Postman et outils sans "Origin"
        if (!origin)
            return callback(null, true);
        // Vérifie si l'origine correspond à un port 517*
        const isViteOrigin = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/i.test(origin);
        if (allowedOrigins.includes(origin) || isViteOrigin) {
            return callback(null, true);
        }
        return callback(new Error(`CORS non autorisé pour ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
// Configuration des routes API
app.use("/api", indexRoutes);
const prisma = new PrismaClient();
// Initialize weekly cleanup scheduler
scheduleWeeklyCleanup();
export default app;
