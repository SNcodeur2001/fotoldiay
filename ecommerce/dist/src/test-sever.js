import express from "express";
const app = express();
const PORT = 4000;
app.get("/", (req, res) => res.send("OK"));
app.listen(PORT, () => {
    console.log(`Serveur test lancé sur http://localhost:${PORT}`);
});
