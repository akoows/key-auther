try {
const { name, ownerID, config } = req.body;
const imageFile = req.file;

// Validações básicas
if (!name || !ownerID || !config || !imageFile) {
    return res.status(400).json({ 
        error: 'Parâmetros inválidos: nome, ownerID, config e imagem são obrigatórios' 
    });
}

// Parse dos dados
let ownersArray, configObj;
try {
    ownersArray = JSON.parse(ownerID);
    configObj = JSON.parse(config);
} catch (parseError) {
    return res.status(400).json({ error: 'Formato inválido para ownerID ou config' });
}

// Validações de estrutura
if (!Array.isArray(ownersArray)) {
    return res.status(400).json({ error: 'ownerID deve ser um array' });
}

if (typeof configObj !== 'object' || !configObj.tag || !configObj.types || !configObj.default_duration) {
    return res.status(400).json({ 
        error: 'Configuração inválida. São necessários: tag, types e default_duration' 
    });
}

// Verificar se os usuários existem
const invalidOwners = ownersArray.filter(id => 
    typeof id !== 'number' || !users.some(u => u.id === id)
);

if (invalidOwners.length > 0) {
    return res.status(400).json({ 
        error: `IDs de usuário inválidos: ${invalidOwners.join(', ')}` 
    });
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

// Criação da aplicação
const newId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;

const application = {
    id: newId,
    name,
    image: uploadResult.secure_url,
    ownerID: ownersArray,
    config: configObj,
    createdAt: new Date().toISOString()
};

applications.push(application);
res.status(201).json(application);

} catch (error) {
console.error('Erro ao criar aplicação:', error);
res.status(500).json({ error: 'Erro interno ao criar aplicação' });
}