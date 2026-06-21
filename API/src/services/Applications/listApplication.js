import { prisma } from "../../lib/prisma.js";

export async function listApplication(ownerId) {
    try {
        if (ownerId) {
            return await prisma.application.findMany({
                where: { ownerIDs: { has: ownerId } }
            });
        }

        return await prisma.application.findMany();
    } catch (error) {
        throw new Error("Erro ao listar aplicações!", { cause: error });
    }
}