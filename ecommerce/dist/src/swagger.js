import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ENV } from "../config/env.js";
const PORT = ENV.PORT || 3000;
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "FotolJaay",
            version: "1.0.0",
            description: "Documentation de FotolJaay",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [
        "./src/modules/**/*.ts",
        "./src/routes/**/*.ts",
        "./src/modules/authentication/swagger.auth.schema.ts",
        "./src/modules/product/swagger.product.schema.ts",
        "./src/modules/category/swagger.category.schema.ts",
        "./src/modules/utilisateur/swagger.utilisateur.schema.ts",
    ],
};
const swaggerSpec = swaggerJSDoc(options);
// Typage correct pour app
export const swaggerDocs = (app, port = PORT) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
