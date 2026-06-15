// BIBLIOTECAS 
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const process = require('process');
const bcrypt = require('bcrypt');

// CONFIGURAÇÃO DO CLOUDINARY
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET 
});

// CONFIGURAÇÃO DO EXPRESS
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

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
// ROTAS DE APLICAÇÕES
// ==============================

// === CRIAR APLICAÇÃO ===
app.post('/api/applications', upload.single('image'), async (req, res) => {
    
});

// === LISTAR APLICAÇÕES ===
app.get('/api/applications', (req, res) => {
    
});

// === OBTER APLICAÇÃO POR ID ===
app.get('/api/applications/:id', (req, res) => {
    
});

// === DELETAR APLICAÇÃO ===
app.delete('/api/applications/:id', (req, res) => {
    
});

// === ATUALIZAR CONFIGURAÇÕES DE UMA APLICAÇÃO ===
app.put('/api/applications/:appId/config', (req, res) => {
  
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
    console.log(`🌐 | Acesse: http://https://keyer.camposcloud.app/api`);
});