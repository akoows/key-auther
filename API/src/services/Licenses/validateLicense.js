import { prisma } from "../../lib/prisma.js";

export async function licenseValidate(licenseID) {
    try {
        const license = await prisma.licenses.findUnique({ where: { id: licenseID } });

        if (!license) {
            throw new Error("Licença não encontrada!");
        }

        const now = new Date();
        const expiration = new Date(license.duration);
        const isExpired = now > expiration;

        if (license.status === true) {
            if (isExpired) {
                await prisma.licenses.update({
                    where: { id: licenseID },
                    data: { status: false }
                });
                throw new Error("Licença expirada!");
            }

            return {
                valid: true,
                status: "active",
                expiresIn: Math.ceil((expiration - now) / (1000 * 60 * 60 * 24)),
                expirationDate: license.duration
            };
        }

        if (license.status === false && !isExpired) {
            const updatedLicense = await prisma.licenses.update({
                where: { id: licenseID },
                data: {
                    activatedAt: now,
                    status: true
                }
            });

            return {
                valid: true,
                status: "activated",
                activatedAt: updatedLicense.activatedAt,
                expirationDate: updatedLicense.duration
            };
        }

        throw new Error("Licença expirada!");
    } catch (error) {
        throw new Error("Erro ao validar licença!", { cause: error });
    }
}