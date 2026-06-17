export async function getAll(ownerId) {
    if (ownerId) {
        return await prisma.application.findMany({
            where: {
                ownerIDs: { has: ownerId },
            },
        });
    }

    return await prisma.application.findMany();
}