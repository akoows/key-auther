import { prisma } from "../../lib/prisma.js";
import { licenseDelete } from "./deleteLicense.js";

export async function licenseValidate(licenseKey) {
    try {
        if (!licenseKey || typeof licenseKey !== "string") {
            throw new Error("key e obrigatoria!");
        }

        const license = await prisma.licenses.findUnique({
            where: { key: licenseKey }
        });

        if (!license) {
            throw new Error("Licenca nao encontrada!");
        }

        const now = new Date();
        const expiration = new Date(license.duration);
        const isExpired = now > expiration;

        if (isExpired) {
            await licenseDelete(license.id);
            throw new Error("Licenca expirada e removida!");
        }

        if (license.status === true) {
            return {
                valid: true,
                status: "active",
                expiresIn: Math.ceil((expiration - now) / (1000 * 60 * 60 * 24)),
                expirationDate: license.duration
            };
        }

        const updatedLicense = await prisma.licenses.update({
            where: { id: license.id },
            data: {
                activatedAt: now,
                status: true
            }
        });

        return {
            valid: true,
            status: "activated",
            activatedAt: updatedLicense.activatedAt,
            expirationDate: updatedLicense.duration
        };
    } catch (error) {
        throw error;
    }
}
