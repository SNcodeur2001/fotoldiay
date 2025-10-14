import { PrismaClient } from "@prisma/client";
class PrismaSingleton {
    static instance;
    constructor() { }
    static getInstance() {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new PrismaClient();
        }
        return PrismaSingleton.instance;
    }
}
const prisma = PrismaSingleton.getInstance();
export default prisma;
