import { prisma } from "../lib/prisma.js";

export async function licenseDelete(licenseID) {
    try {
        const license = await prisma.licenses.findUnique({ where: { id: licenseID } });

        if (!license) {
            throw new Error("Licença não encontrada!");
        }

        await prisma.licenses.delete({ where: { id: licenseID } });
    } catch (error) {
        throw new Error("Erro ao deletar licença!", { cause: error });
    }
}