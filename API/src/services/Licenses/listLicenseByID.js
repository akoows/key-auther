import { prisma } from "../../lib/prisma.js";

export async function listLicenses(data) {
    try {
        return await prisma.licenses.findMany({
            where: { licensesOwnerID: { has: data.userId } }
        });
    } catch (error) {
        throw new Error("Erro ao listar licenças!", { cause: error });
    }
}