// Bibliotecas
import express from "express";

// Routers
import appRouter from "./routes/appRouter.js";
import userRouter from "./routes/userRoutes.js";
import licenseRouter from "./routes/licenseRouter.js";

const router = express.Router();

// Instanciando Rotas
router.use("/users", userRouter);
router.use("/applications", appRouter);
router.use("/licenses", licenseRouter);
// Exportando router
export { router };