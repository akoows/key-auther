import { prisma } from "../lib/prisma.js";
import { cloudinary } from "../lib/cloudinary.js";
import stream from "stream";

export async function getById(id) {
    const application = await prisma.application.findUnique({
        where: { id },
    });

    if (!application) {
        throw new Error("Aplicação não encontrada!");
    }

    return application;
}

export async function create({ name, ownerID, config, imageFile }) {
    // Validações básicas
    if (!name || !ownerID || !config || !imageFile) {
        throw new Error("Parâmetros inválidos: nome, ownerID, config e imagem são obrigatórios");
    }

    // Parse dos dados
    let ownersArray, configObj;
    try {
        ownersArray = JSON.parse(ownerID);
        configObj = JSON.parse(config);
    } catch {
        throw new Error("Formato inválido para ownerID ou config");
    }

    // Validações de estrutura
    if (!Array.isArray(ownersArray)) {
        throw new Error("ownerID deve ser um array");
    }

    if (typeof configObj !== 'object' || !configObj.tag || !configObj.types || !configObj.default_duration) {
        throw new Error("Configuração inválida. São necessários: tag, types e default_duration");
    }

    // Verificar se os usuários existem no banco
    const existingUsers = await prisma.user.findMany({
        where: { id: { in: ownersArray } },
        select: { id: true },
    });

    const existingIDs = existingUsers.map(u => u.id);
    const invalidOwners = ownersArray.filter(id => !existingIDs.includes(id));

    if (invalidOwners.length > 0) {
        throw new Error(`IDs de usuário inválidos: ${invalidOwners.join(', ')}`);
    }

    // Upload da imagem para Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'applications', resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(imageFile.buffer);
        bufferStream.pipe(uploadStream);
    });

    // Criação no banco
    const application = await prisma.application.create({
        data: {
            name,
            image: uploadResult.secure_url,
            config: configObj,
            ownerIDs: ownersArray,
        },
    });

    return application;
}