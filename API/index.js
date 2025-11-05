// BIBLIOTECAS 
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const e = require('express');

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

// ARMAZENAMENTO EM MEMÓRIA
let users = [];
let licenses = [];
const upload = multer({ storage: multer.memoryStorage() });

// USUÁRIOS
app.post('/api/users', (req, res) => { // Criar usuário
    const { name, pass } = req.body;

    if (!name || !pass) return res.status(400).json({ error: 'Parâmetros inválidos' });
    if (typeof name !== 'string' || typeof pass !== 'string') return res.status(400).json({ error: 'Tipos inválidos' });
    if (users.find(u => u.name === name)) return res.status(409).json({ error: 'Nome de usuário já existe' });

    const user = {
        id: users.length + 1,
        name,
        pass,
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://res.cloudinary.com/dylkeqcms/image/upload/v1762125098/default_uqhrk3.jpg'
    };

    // Se existir o id no banco, adicionar 1 ao id
    if (users.find(u => u.id === user.id)) {
        user.id = users.length + 2;
    }

    users.push(user);
    res.status(201).json(user);
});
app.get('/api/users', (req, res) => res.json(users)); // Listar todos os usuários
app.get('/api/users/:id', (req, res) => { // Obter usuário por ID
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
});
app.get('/api/users/name/:name', (req, res) => { // Obter usuário por nome e senha
    const userName = req.params.name;
    const password = req.query.pass;
    const user = users.find(u => u.name === userName && u.pass === password);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado ou senha incorreta' });
    res.json(user);
});
app.put('/api/users/:id', (req, res) => { // Atualizar usuário
    const userId = parseInt(req.params.id);
    const { name, pass } = req.body;
    const user = users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (name) {
        if (typeof name !== 'string') return res.status(400).json({ error: 'Nome inválido' });
        if (users.find(u => u.name === name && u.id !== userId)) return res.status(409).json({ error: 'Nome de usuário já existe' });
        user.name = name;
    }

    if (pass) {
        if (typeof pass !== 'string') return res.status(400).json({ error: 'Senha inválida' });
        user.pass = pass;
    }

    res.json(user);
});
app.delete('/api/users/:id', (req, res) => { // Deletar usuário
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

    users.splice(index, 1);
    res.status(204).send();
});
app.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => { // Enviar avatar
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Tipo de arquivo inválido. Apenas JPEG, PNG e GIF são permitidos.' });
    }

    try {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'avatars', resource_type: 'image' },
            (error, result) => {
                if (error) return res.status(500).json({ error: error.message });
                user.avatarUrl = result.secure_url;
                res.json({ msg: 'Avatar enviado com sucesso', url: result.secure_url });
            }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(uploadStream);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// LICENÇAS
app.post('/api/licenses', (req, res) => { // Criar licença
    const { userId, type, durationDays } = req.body;

    if (!userId || !type || !durationDays) return res.status(400).json({ error: 'Parâmetros inválidos' });
    if (typeof userId !== 'string' || typeof type !== 'string' || typeof durationDays !== 'number') return res.status(400).json({ error: 'Tipos inválidos' });
    if (!['basic', 'premium', 'pro'].includes(type.toLowerCase())) return res.status(400).json({ error: 'Tipo de licença inválido' });

    const user = users.find(u => u.id === parseInt(userId));
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const licenseKey = `${type.toUpperCase()}-${Math.random().toString(36).substring(2,7).toUpperCase()}-${Math.random().toString(36).substring(2,7).toUpperCase()}-${Math.random().toString(36).substring(2,7).toUpperCase()}`;

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + durationDays);
    const expirationPTBR = expirationDate.toLocaleDateString('pt-BR'); 


    const license = {
        licenseKey,
        userId,
        type,
        createdAt: new Date().toISOString(),
        expirationDate: expirationPTBR
    };

    licenses.push(license);
    res.status(201).json(license);
});
app.get('/api/licenses', (req, res) => res.json(licenses)); // Listar todas as licenças
app.get('/api/licenses/user/:userId', (req, res) => { // Listar licenças por usuário
    const userId = req.params.userId;
    const userLicenses = licenses.filter(l => l.userId === userId);
    res.json(userLicenses);
});
app.get('/api/licenses/:licenseKey', (req, res) => { // Obter licença por chave
    const licenseKey = req.params.licenseKey;
    const license = licenses.find(l => l.licenseKey === licenseKey);
    if (!license) return res.status(404).json({ error: 'Licença não encontrada' });
    res.json(license);
});
app.patch('/api/licenses/:licenseKey', (req, res) => { // Atualizar licença
    const licenseKey = req.params.licenseKey;
    const { type, durationDays } = req.body;
    const license = licenses.find(l => l.licenseKey === licenseKey);
    if (!license) return res.status(404).json({ error: 'Licença não encontrada' });

    if (type) {
        if (typeof type !== 'string' || !['basic','premium','pro'].includes(type.toLowerCase())) 
            return res.status(400).json({ error: 'Tipo de licença inválido' });
        license.type = type;
    }

    if (durationDays) {
        if (typeof durationDays !== 'number') return res.status(400).json({ error: 'Duração inválida' });
        const newExpirationDate = new Date(license.expirationDate);
        newExpirationDate.setDate(newExpirationDate.getDate() + durationDays);
        license.expirationDate = newExpirationDate.toISOString();
    }

    res.json(license);
});
app.delete('/api/licenses/:licenseKey', (req, res) => { // Deletar licença
    const licenseKey = req.params.licenseKey;
    const index = licenses.findIndex(l => l.licenseKey === licenseKey);
    if (index === -1) return res.status(404).json({ error: 'Licença não encontrada' });

    licenses.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => console.log(`🟢 | API rodando na porta: ${port}!`));