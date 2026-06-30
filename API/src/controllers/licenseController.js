import { licenseCreate } from "../services/Licenses/CreateLicences.js";
import { licenseDelete } from "../services/Licenses/DeleteLicences.js";
import { listLicenses } from "../services/Licenses/ListLicences.js";
import { licenseEdit } from "../services/Licenses/updateLicences.js";
import { licenseValidate } from "../services/Licenses/validateLicences.js";

export async function createLicenseController(req, res) {
    try {
        const license = await licenseCreate(req.body);
        return res.status(201).json(license);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function listLicensesController(req, res) {
    try {
        const licenses = await listLicenses(req.query);
        return res.status(200).json(licenses);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function editLicenseController(req, res) {
    try {
        const { id } = req.params;
        const license = await licenseEdit(id, req.body);
        return res.status(200).json(license);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteLicenseController(req, res) {
    try {
        const { id } = req.params;
        await licenseDelete(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

export async function validateLicenseController(req, res) {
    try {
        const { key } = req.body;
        const result = await licenseValidate(key);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}