export function listLicenses(data) {
    try {
        const uId = data.userId;
        return await prisma.licenses.findMany({
            where: { licensesOwnerID }
        })
    } catch (error) {
        throw new Error(error);
    }
}