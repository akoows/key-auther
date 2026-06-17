// BIBLIOTECAS 
import { express } from "express";
import { cors } from "cors";
import { multer } from "multer"
import { cloudinary } from "cloudinary";
import { stream } from "stream";
import { process } from "process";
import { bcrypt } from "bcrypt";

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