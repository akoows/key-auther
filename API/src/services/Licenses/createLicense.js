const { userId, durationDays, appTag } = req.body;

// Validações
if (!userId || !durationDays || !appTag) {
    return res.status(400).json({ error: 'Parâmetros inválidos: userId, durationDays e appTag são obrigatórios' });
}

if (typeof userId !== 'string' || typeof durationDays !== 'number' || typeof appTag !== 'string') {
    return res.status(400).json({ error: 'Tipos inválidos' });
}

const { user } = validateUserExists(userId);
if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
}

// Geração da chave da licença com a tag da aplicação
const generateLicenseKey = () => {
    const randomPart = () => Math.random().toString(36).substring(2,7).toUpperCase();
    return `${appTag.toUpperCase()}-${randomPart()}-${randomPart()}-${randomPart()}`;
};

const license = {
    licenseKey: generateLicenseKey(),
    userId,
    appTag,
    durationDays,
    createdAt: new Date().toISOString(),
    activatedAt: null, // Será preenchido quando a licença for ativada
    status: 'inactive', // inactive, active, expired
    expirationDate: null // Será calculado quando a licença for ativada
};

licenses.push(license);
res.status(201).json(license);