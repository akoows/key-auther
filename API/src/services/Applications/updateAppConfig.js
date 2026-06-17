export async function updateConfig(id, { tag, default_duration }) {
    if (!tag || !default_duration || isNaN(default_duration)) {
        throw new Error("Campos inválidos.");
    }

    const application = await prisma.application.findUnique({
        where: { id },
    });

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
            },
        },
    });

    return updated;
}