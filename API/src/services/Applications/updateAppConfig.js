import { prisma } from "../../lib/prisma.js";

export async function updateAppConfig(id, { tag, default_duration }) {
    try {
        if (!tag || !default_duration || isNaN(default_duration)) {
            throw new Error("Campos inválidos.");
        }

        const application = await prisma.application.findUnique({ where: { id } });

        if (!application) {
            throw new Error("Aplicação não encontrada!");
        }

        const updated = await prisma.application.update({
            where: { id },
            data: {
                config: {
                    ...application.config,
                    tag,
                    default_duration: parseInt(default_duration),
                }
            }
        });

        return updated;
    } catch (error) {
        throw new Error("Erro ao atualizar configuração!", { cause: error });
    }
}