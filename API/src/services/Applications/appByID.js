import { prisma } from "../lib/prisma.js";

export async function getById(id) {
    const application = await prisma.application.findUnique({
        where: { id },
    });

    if (!application) {
        throw new Error("Aplicação não encontrada!");
    }

    return application;
}