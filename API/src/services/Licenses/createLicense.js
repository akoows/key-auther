import { prisma } from "../../lib/prisma.js";

function resolveExpirationDate({ durationDays, expiresAt }) {
    if (expiresAt) {
        const expirationDate = new Date(expiresAt);

        if (Number.isNaN(expirationDate.getTime())) {
            throw new Error("expiresAt invalido!");
        }

        return expirationDate;
    }

    const days = Number(durationDays);

    if (!durationDays || Number.isNaN(days) || days <= 0) {
        throw new Error("durationDays invalido!");
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    return expirationDate;
}

export async function licenseCreate(data) {
    try {
        const appId = data.appId || data.applicationId;

        if (!appId) {
            throw new Error("appId e obrigatorio!");
        }

        if (typeof appId !== "string") {
            throw new Error("Tipos invalidos!");
        }

        const expirationDate = resolveExpirationDate(data);
        const application = await prisma.application.findUnique({
            where: { id: appId },
            select: {
                id: true,
                name: true,
                config: true
            }
        });

        if (!application) {
            throw new Error("Aplicacao nao encontrada!");
        }

        const licensePrefix = application.config?.tag || application.name || "LICENSE";
        const randomPart = () => Math.random().toString(36).substring(2, 7).toUpperCase();
        const licenseKey = `${licensePrefix.toUpperCase()}-${randomPart()}-${randomPart()}-${randomPart()}`;

        const license = await prisma.licenses.create({
            data: {
                key: licenseKey,
                duration: expirationDate,
                activatedAt: null,
                status: false,
                licensesOwnerID: [application.id]
            }
        });

        await prisma.application.update({
            where: { id: application.id },
            data: { licenses: { push: license.id } }
        });

        return license;
    } catch (error) {
        throw error;
    }
}
