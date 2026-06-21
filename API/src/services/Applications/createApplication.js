import { prisma } from "../../lib/prisma.js";
import { cloudinary } from "../../lib/cloudinary.js";
import stream from "stream";

export async function createApplication({ name, ownerID, config, imageFile }) {
    try {
        if (!name || !ownerID || !config || !imageFile) {
            throw new Error("Parâmetros inválidos: nome, ownerID, config e imagem são obrigatórios");
        }

        let ownersArray, configObj;
        try {
            ownersArray = JSON.parse(ownerID);
            configObj = JSON.parse(config);
        } catch {
            throw new Error("Formato inválido para ownerID ou config");
        }

        if (!Array.isArray(ownersArray)) {
            throw new Error("ownerID deve ser um array");
        }

        if (typeof configObj !== "object" || !configObj.tag || !configObj.types || !configObj.default_duration) {
            throw new Error("Configuração inválida. São necessários: tag, types e default_duration");
        }

        const existingUsers = await prisma.user.findMany({
            where: { id: { in: ownersArray } },
            select: { id: true },
        });

        const existingIDs = existingUsers.map(u => u.id);
        const invalidOwners = ownersArray.filter(id => !existingIDs.includes(id));

        if (invalidOwners.length > 0) {
            throw new Error(`IDs de usuário inválidos: ${invalidOwners.join(", ")}`);
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "applications", resource_type: "image" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            const bufferStream = new stream.PassThrough();
            bufferStream.end(imageFile.buffer);
            bufferStream.pipe(uploadStream);
        });

        const application = await prisma.application.create({
            data: {
                name,
                image: uploadResult.secure_url,
                config: configObj,
                ownerIDs: ownersArray,
            },
        });

        await prisma.user.updateMany({
            where: { id: { in: ownersArray } },
            data: { applicationIDs: { push: application.id } }
        });

        return application;
    } catch (error) {
        throw new Error("Erro ao criar aplicação!", { cause: error });
    }
}