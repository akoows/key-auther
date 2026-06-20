import { prisma } from "../lib/prisma.js";

export async function licenseCreate(data) {
    try {
        if (!data.userId || !data.durationDays || !data.appTag) {
            throw new Error("Parâmetros inválidos: userId, durationDays e appTag são obrigatórios!");
        }

        if (typeof data.userId !== "string" || typeof data.durationDays !== "number" || typeof data.appTag !== "string") {
            throw new Error("Tipos inválidos!");
        }

        const user = await prisma.user.findUnique({ where: { id: data.userId } });

        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        const application = await prisma.application.findFirst({ where: { name: data.appTag } });

        if (!application) {
            throw new Error("Aplicação não encontrada!");
        }

        const randomPart = () => Math.random().toString(36).substring(2, 7).toUpperCase();
        const licenseKey = `${data.appTag.toUpperCase()}-${randomPart()}-${randomPart()}-${randomPart()}`;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + data.durationDays);

        const license = await prisma.licenses.create({
            data: {
                duration: expirationDate,
                activatedAt: null,
                status: false,
                licensesOwnerID: [application.id]
            }
        });

        return license;
    } catch (error) {
        throw new Error("Erro ao criar licença!", { cause: error });
    }
}