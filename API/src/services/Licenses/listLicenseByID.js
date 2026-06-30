import { prisma } from "../../lib/prisma.js";

export async function listLicenses(data) {
    try {
        const appId = data.appId || data.applicationId;

        if (!appId) {
            throw new Error("appId e obrigatorio!");
        }

        if (typeof appId !== "string") {
            throw new Error("Tipos invalidos!");
        }

        const application = await prisma.application.findUnique({
            where: { id: appId },
            select: { id: true }
        });

        if (!application) {
            throw new Error("Aplicacao nao encontrada!");
        }

        return await prisma.licenses.findMany({
            where: { licensesOwnerID: { has: application.id } },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        throw error;
    }
}
