import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export async function validateUser(login, password) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: login
            },
        });
        if (!user)
            return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return null;
        return user;
    }
    catch (error) {
        console.error("Erreur lors de la validation de l'utilisateur :", error);
        return null;
    }
}
