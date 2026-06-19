import { prisma } from "../lib/prisma.js";

export async function getById(id) {
    const application = await prisma.application.findUnique({
        where: { licensesOwnerID }
    });

    if (!application) {
        throw new Error("Aplicação não encontrada!");
    }

    return application;
}