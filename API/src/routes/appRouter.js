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

appRouter.get("/applications", listApplicationController);
appRouter.get("/applications/:id", appByIDController);
appRouter.post("/applications", uploadMiddleware, createApplicationController);
appRouter.delete("/applications/:id", deleteApplicationController);
appRouter.patch("/applications/:id/config", updateAppConfigController);

export default appRouter;