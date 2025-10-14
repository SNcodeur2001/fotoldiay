import dotenv from "dotenv";
import app from "./app.js";
// import { swaggerDocs } from "./swagger.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.get("/hello", (req, res) => res.send("Hello World!"));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Serveur bien demarre sur l'addresse http://localhost:${PORT}`);
  console.log(`Serveur demarre en ${process.env.NODE_ENV} mode`);
});
