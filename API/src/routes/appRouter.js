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

appRouter.get(listApplicationController);
appRouter.get("/:id", appByIDController);
appRouter.post(uploadMiddleware, createApplicationController);
appRouter.delete("/:id", deleteApplicationController);
appRouter.patch("/:id/config", updateAppConfigController);

export default appRouter;