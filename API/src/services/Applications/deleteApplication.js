import { prisma } from "../../lib/prisma.js";

export async function deleteApplication(id) {
    try {
        const application = await prisma.application.findUnique({ where: { id } });

        if (!application) {
            throw new Error("Aplicação não encontrada!");
        }

        await prisma.application.delete({ where: { id } });
    } catch (error) {
        throw new Error("Erro ao deletar aplicação!", { cause: error });
    }
}