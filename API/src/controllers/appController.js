import { appByID } from "../services/Applications/appByID.js";
import { createApplication } from "../services/Applications/createApplication.js";
import { deleteApplication } from "../services/Applications/deleteApplication.js";
import { listApplication } from "../services/Applications/listApplication.js";
import { updateAppConfig } from "../services/Applications/updateAppConfig.js";
import { upload } from "../lib/multer.js";

export const uploadMiddleware = upload.single("image");

export async function appByIDController(req, res) {
    try {
        const { id } = req.params;
        const application = await appByID(id);
        return res.status(200).json(application);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

export async function createApplicationController(req, res) {
    try {
        const { name, ownerID, config } = req.body;
        const imageFile = req.file;
        const application = await createApplication({ name, ownerID, config, imageFile });
        return res.status(201).json(application);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteApplicationController(req, res) {
    try {
        const { id } = req.params;
        await deleteApplication(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

export async function listApplicationController(req, res) {
    try {
        const { ownerId } = req.query;
        const applications = await listApplication(ownerId);
        return res.status(200).json(applications);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateAppConfigController(req, res) {
    try {
        const { id } = req.params;
        const { tag, default_duration } = req.body;
        const updated = await updateAppConfig(id, { tag, default_duration });
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}