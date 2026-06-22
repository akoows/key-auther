import { Router } from "express";
import {
    appByIDController,
    createApplicationController,
    deleteApplicationController,
    listApplicationController,
    updateAppConfigController,
    uploadMiddleware
} from "../controllers/appController.js";

const appRouter = Router();

appRouter.get("/", listApplicationController); // Listar aplicativos
appRouter.get("/:id", appByIDController); // Listar aplicatativos por ID
appRouter.post("/", uploadMiddleware, createApplicationController); // Criar aplicativo
appRouter.delete("/:id", deleteApplicationController); // Deletar aplicação
appRouter.patch("/:id/config", updateAppConfigController); // Editar aplicação

export default appRouter;