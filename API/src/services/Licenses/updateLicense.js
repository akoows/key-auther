import { prisma } from "../../lib/prisma.js";

export async function licenseEdit(licenseID, data) {
    try {
        const license = await prisma.licenses.findUnique({ where: { id: licenseID } });

        if (!license) {
            throw new Error("Licença não encontrada!");
        }

        if (data.durationDays && typeof data.durationDays !== "number") {
            throw new Error("Duração inválida!");
        }

        const newExpiration = data.durationDays
            ? new Date(license.duration.setDate(license.duration.getDate() + data.durationDays))
            : license.duration;

        const updatedLicense = await prisma.licenses.update({
            where: { id: licenseID },
            data: {
                duration: newExpiration
            }
        });

        return updatedLicense;
    } catch (error) {
        throw new Error("Erro ao editar licença!", { cause: error });
    }
}