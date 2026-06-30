import { prisma } from "../../lib/prisma.js";

export async function deleteApplication(id) {
    try {
        if (!id) {
            throw new Error("id da aplicacao e obrigatorio!");
        }

        const application = await prisma.application.findUnique({
            where: { id },
            select: {
                id: true,
                ownerIDs: true,
                licenses: true
            }
        });

        if (!application) {
            throw new Error("Aplicacao nao encontrada!");
        }

        await prisma.licenses.deleteMany({
            where: { licensesOwnerID: { has: id } }
        });

        const owners = await prisma.user.findMany({
            where: { id: { in: application.ownerIDs } },
            select: {
                id: true,
                applicationIDs: true
            }
        });

        for (const owner of owners) {
            await prisma.user.update({
                where: { id: owner.id },
                data: {
                    applicationIDs: owner.applicationIDs.filter((applicationID) => applicationID !== id)
                }
            });
        }

        await prisma.application.delete({ where: { id } });
    } catch (error) {
        throw error;
    }
}
