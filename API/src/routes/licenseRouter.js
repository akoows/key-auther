import { Router } from "express";

import {
    createLicenseController,
    deleteLicenseController,
    editLicenseController,
    listLicensesController,
    validateLicenseController
} from "../controllers/licenseController.js";

const licenseRouter = Router();

licenseRouter.get("/", listLicensesController);
licenseRouter.post("/", createLicenseController);
licenseRouter.post("/validate", validateLicenseController);
licenseRouter.patch("/:id", editLicenseController);
licenseRouter.delete("/:id", deleteLicenseController);

export default licenseRouter;