export async function remove(id) {
    const application = await prisma.application.findUnique({
        where: { id },
    });

    if (!application) {
        throw new Error("Aplicação não encontrada!");
    }

    await prisma.application.delete({
        where: { id },
    });
}