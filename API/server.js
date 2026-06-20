import express from "express";
import { appRouter } from "./index.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas
app.use(appRouter);
console.log("✅ Rotas de aplicação carregadas");

// Iniciando servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});