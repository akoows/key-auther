// BIBLIOTECAS 
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const bcrypt = require('bcrypt');

// CONFIGURAÇÃO DO CLOUDINARY
cloudinary.config({ 
    cloud_name: 'dylkeqcms', 
    api_key: '568165947632319', 
    api_secret: 'nV1Gz6X2xZ8xOdpqWyAOZlGj_Ok' 
});

// CONFIGURAÇÃO DO EXPRESS
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// SERVIR ARQUIVOS ESTÁTICOS
app.use(express.static('.'));

// ARMAZENAMENTO EM MEMÓRIA
let users = [];
let licenses = [];
let applications = [];
const upload = multer({ storage: multer.memoryStorage() });

// ==============================
// MIDDLEWARES AUXILIARES
// ==============================

const validateUserExists = (userId) => {
    const user = users.find(u => u.id === parseInt(userId));
    return { user, exists: !!user };
};

const validateApplicationExists = (appId) => {
    const application = applications.find(a => a.id === parseInt(appId));
    return { application, exists: !!application };
};

const validateLicenseExists = (licenseKey) => {
    const license = licenses.find(l => l.licenseKey === licenseKey);
    return { license, exists: !!license };
};

// ==============================
// ROTAS DE USUÁRIOS
// ==============================

// === CRIAR USUÁRIO ===
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, pass } = req.body;

        // Validações
        if (!name || !pass || !email) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }
        
        if (typeof name !== 'string' || typeof pass !== 'string' || typeof email !== 'string') {
            return res.status(400).json({ error: 'Tipos inválidos' });
        }
        
        if (users.find(u => u.name === name)) {
            return res.status(409).json({ error: 'Nome de usuário já existe' });
        }

        // Criação do usuário
        const hashedPass = await bcrypt.hash(pass, 10);
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        const user = {
            id: newId,
            name,
            email,
            pass: hashedPass,
            createdAt: new Date().toISOString(),
            avatarUrl: 'https://res.cloudinary.com/dylkeqcms/image/upload/v1762125098/default_uqhrk3.jpg'
        };

        users.push(user);

        // Retorna usuário sem senha
        const { pass: _, ...safeUser } = user;
        res.status(201).json(safeUser);

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// === LISTAR TODOS OS USUÁRIOS ===
app.get('/api/users', (req, res) => {
    const safeUsers = users.map(user => {
        const { pass, ...safeUser } = user;
        return safeUser;
    });
    res.json(safeUsers);
});

// === OBTER USUÁRIO POR ID ===
app.get('/api/users/:id', (req, res) => {
    const { user } = validateUserExists(req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { pass, ...safeUser } = user;
    res.json(safeUser);
});

// === LOGIN ===
app.post('/api/users/login', async (req, res) => {
    const { name, pass } = req.body;
    const user = users.find(u => u.name === name);
    
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const valid = await bcrypt.compare(pass, user.pass);
    if (!valid) {
        return res.status(401).json({ error: "Senha incorreta" });
    }

    res.json({ id: user.id, name: user.name, email: user.email });
});

// === ATUALIZAR USUÁRIO ===
app.put('/api/users/:id', async (req, res) => {
    const { user } = validateUserExists(req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { name, pass } = req.body;

    if (name) {
        if (typeof name !== 'string') {
            return res.status(400).json({ error: 'Nome inválido' });
        }
        if (users.find(u => u.name === name && u.id !== user.id)) {
            return res.status(409).json({ error: 'Nome de usuário já existe' });
        }
        user.name = name;
    }

    if (pass) {
        if (typeof pass !== 'string') {
            return res.status(400).json({ error: 'Senha inválida' });
        }
        user.pass = await bcrypt.hash(pass, 10);
    }

    const { pass: _, ...safeUser } = user;
    res.json(safeUser);
});

// === DELETAR USUÁRIO ===
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    users.splice(index, 1);
    res.status(204).send();
});

// === ENVIAR AVATAR ===
app.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
    const { user } = validateUserExists(req.params.id);
    
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(req.file.mimetype)) {
        return res.status(400).json({ 
            error: 'Tipo de arquivo inválido. Apenas JPEG, PNG e GIF são permitidos.' 
        });
    }

    try {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'avatars', resource_type: 'image' },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                user.avatarUrl = result.secure_url;
                res.json({ 
                    msg: 'Avatar enviado com sucesso', 
                    url: result.secure_url 
                });
            }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(uploadStream);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==============================
// ROTAS DE LICENÇAS
// ==============================

// === CRIAR LICENÇA ===
app.post('/api/licenses', (req, res) => {
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
});

// === VALIDAR LICENÇA ===
app.post('/api/licenses/:licenseKey/validate', (req, res) => {
    const { license } = validateLicenseExists(req.params.licenseKey);
    
    if (!license) {
        return res.status(404).json({ error: 'Licença não encontrada' });
    }

    // Se a licença já está ativa, verifica se expirou
    if (license.status === 'active') {
        const now = new Date();
        const expiration = new Date(license.expirationDate);
        
        if (now > expiration) {
            license.status = 'expired';
            return res.status(400).json({ 
                error: 'Licença expirada',
                status: 'expired'
            });
        }

        return res.json({
            valid: true,
            status: 'active',
            expiresIn: Math.ceil((expiration - now) / (1000 * 60 * 60 * 24)),
            expirationDate: license.expirationDate
        });
    }

    // Se a licença está inativa, ativa ela
    if (license.status === 'inactive') {
        const activatedAt = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(activatedAt.getDate() + license.durationDays);

        license.activatedAt = activatedAt.toISOString();
        license.expirationDate = expirationDate.toISOString();
        license.status = 'active';

        return res.json({
            valid: true,
            status: 'activated',
            activatedAt: license.activatedAt,
            expirationDate: license.expirationDate,
            durationDays: license.durationDays
        });
    }

    // Licença expirada
    return res.status(400).json({
        error: 'Licença expirada',
        status: 'expired'
    });
});

// === LISTAR TODAS AS LICENÇAS ===
app.get('/api/licenses', (req, res) => {
    res.json(licenses);
});

// === LISTAR LICENÇAS POR USUÁRIO ===
app.get('/api/licenses/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const userLicenses = licenses.filter(l => l.userId === userId);
    res.json(userLicenses);
});

// === ATUALIZAR LICENÇA ===
app.patch('/api/licenses/:licenseKey', (req, res) => {
    const { license } = validateLicenseExists(req.params.licenseKey);
    
    if (!license) {
        return res.status(404).json({ error: 'Licença não encontrada' });
    }

    const { type, durationDays } = req.body;

    if (type) {
        const validTypes = ['basic', 'premium', 'pro'];
        if (typeof type !== 'string' || !validTypes.includes(type.toLowerCase())) {
            return res.status(400).json({ error: 'Tipo de licença inválido' });
        }
        license.type = type;
    }

    if (durationDays) {
        if (typeof durationDays !== 'number') {
            return res.status(400).json({ error: 'Duração inválida' });
        }
        const newExpirationDate = new Date(license.expirationDate);
        newExpirationDate.setDate(newExpirationDate.getDate() + durationDays);
        license.expirationDate = newExpirationDate.toISOString();
    }

    res.json(license);
});

// === DELETAR LICENÇA ===
app.delete('/api/licenses/:licenseKey', (req, res) => {
    const licenseKey = req.params.licenseKey;
    const index = licenses.findIndex(l => l.licenseKey === licenseKey);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Licença não encontrada' });
    }

    licenses.splice(index, 1);
    res.status(204).send();
});

// ==============================
// ROTAS DE APLICAÇÕES
// ==============================

// === CRIAR APLICAÇÃO ===
app.post('/api/applications', upload.single('image'), async (req, res) => {
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
});

// === LISTAR APLICAÇÕES ===
app.get('/api/applications', (req, res) => {
    const { ownerId } = req.query;
    
    if (ownerId) {
        const userId = parseInt(ownerId);
        const userApplications = applications.filter(app => 
            app.ownerID.includes(userId)
        );
        return res.json(userApplications);
    }
    
    res.json(applications);
});

// === OBTER APLICAÇÃO POR ID ===
app.get('/api/applications/:id', (req, res) => {
    const { application } = validateApplicationExists(req.params.id);
    
    if (!application) {
        return res.status(404).json({ error: 'Aplicação não encontrada' });
    }
    
    res.json(application);
});

// === DELETAR APLICAÇÃO ===
app.delete('/api/applications/:id', (req, res) => {
    const { application, exists } = validateApplicationExists(req.params.id);
    
    if (!exists) {
        return res.status(404).json({ error: 'Aplicação não encontrada' });
    }

    const index = applications.findIndex(a => a.id === application.id);
    applications.splice(index, 1);
    res.status(204).send();
});

// === ATUALIZAR CONFIGURAÇÕES DE UMA APLICAÇÃO ===
app.put('/api/applications/:appId/config', (req, res) => {
  const { appId } = req.params;
  const { tag, default_duration } = req.body;

  if (!tag || !default_duration || isNaN(default_duration)) {
    return res.status(400).json({ error: 'Campos inválidos.' });
  };

  const appIndex = applications.findIndex(a => a.id === parseInt(appId));

  if (appIndex === -1) {
    return res.status(404).json({ error: 'Aplicação não encontrada.' });
  }

  applications[appIndex].config.tag = tag;
  applications[appIndex].config.default_duration = parseInt(default_duration);

  res.json({
    message: 'Configurações atualizadas com sucesso.',
    updatedApp: applications[appIndex]
  });
});


// ==============================
// ROTA RAIZ
// ==============================
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ==============================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================

app.listen(port, () => {
    console.log(`🟢 | API rodando na porta: ${port}!`);
    console.log(`📝 | Endpoints disponíveis:`);
    console.log(`   👤 Users: POST/GET/PUT/DELETE /api/users`);
    console.log(`   🔑 Licenses: POST/GET/PATCH/DELETE /api/licenses`);
    console.log(`   📱 Applications: POST/GET/DELETE /api/applications`);
    console.log(`🌐 | Acesse: http://localhost:${port}`);
});