import { prisma } from "../../lib/prisma.js";

export async function licenseEdit(licenseID, data) {
    try {
        if (!licenseID) {
            throw new Error("licenseID e obrigatorio!");
        }

        const license = await prisma.licenses.findUnique({ where: { id: licenseID } });

        if (!license) {
            throw new Error("Licenca nao encontrada!");
        }

        const updateData = {};

        if (data.expiresAt !== undefined) {
            const expirationDate = new Date(data.expiresAt);

            if (Number.isNaN(expirationDate.getTime())) {
                throw new Error("expiresAt invalido!");
            }

            updateData.duration = expirationDate;
        } else if (data.durationDays !== undefined) {
            const durationDays = Number(data.durationDays);

            if (Number.isNaN(durationDays) || durationDays <= 0) {
                throw new Error("durationDays invalido!");
            }

            const expirationDate = new Date(license.duration);
            expirationDate.setDate(expirationDate.getDate() + durationDays);
            updateData.duration = expirationDate;
        }

        if (data.status !== undefined || data.active !== undefined) {
            const status = data.status ?? data.active;

            if (typeof status !== "boolean") {
                throw new Error("status/active deve ser booleano!");
            }

            updateData.status = status;

            if (status === true && !license.activatedAt) {
                updateData.activatedAt = new Date();
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("Nenhum campo valido para atualizar!");
        }

        return await prisma.licenses.update({
            where: { id: licenseID },
            data: updateData
        });
    } catch (error) {
        throw error;
    }
}
