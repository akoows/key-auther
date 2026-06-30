import { prisma } from "../../lib/prisma.js";

export async function licenseDelete(licenseID) {
    try {
        if (!licenseID) {
            throw new Error("licenseID e obrigatorio!");
        }

        const license = await prisma.licenses.findUnique({ where: { id: licenseID } });

        if (!license) {
            throw new Error("Licenca nao encontrada!");
        }

        const applications = await prisma.application.findMany({
            where: { id: { in: license.licensesOwnerID } },
            select: {
                id: true,
                licenses: true
            }
        });

        for (const application of applications) {
            await prisma.application.update({
                where: { id: application.id },
                data: {
                    licenses: application.licenses.filter((id) => id !== licenseID)
                }
            });
        }

        await prisma.licenses.delete({ where: { id: licenseID } });
    } catch (error) {
        throw error;
    }
}
