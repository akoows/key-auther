import { prisma } from "../../lib/prisma.js";

export async function appByID(id) {
    try {
        const application = await prisma.application.findUnique({ where: { id } });

        if (!application) {
            throw new Error("Aplicação não encontrada!");
        }

        return application;
    } catch (error) {
        throw new Error("Erro ao buscar aplicação!", { cause: error });
    }
}