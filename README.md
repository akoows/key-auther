# 🔑 Key Author

![Logo](./logo.png)

O **Key Author** é um sistema completo de **autenticação e gerenciamento de chaves via API**, com **painel web** e **aplicativo**.  
Ele permite criar, validar e administrar licenças, aplicações e usuários — tudo em um só ecossistema.

---

## ⚙️ Tecnologias Utilizadas

| Área | Tecnologias |
|------|--------------|
| **Backend** | Node.js, Express, Multer, Cloudinary, Bcrypt, CORS |
| **Frontend (Web/App)** | HTML5, CSS3, JavaScript |
| **Banco de Dados (temporário)** | Memória (simulação, pode ser adaptado para MongoDB ou MySQL) |
| **Upload de Imagens** | Cloudinary |

---

---

## 🚀 Instalação e Execução

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seuusuario/key-author.git
cd key-author
````

### 2️⃣ Instalar dependências

```bash
npm install express cors multer cloudinary bcrypt
```

### 3️⃣ Configurar as credenciais do Cloudinary

No topo do arquivo `api.js`, substitua pelas suas credenciais:

```js
cloudinary.config({ 
  cloud_name: 'SEU_CLOUD_NAME', 
  api_key: 'SUA_API_KEY', 
  api_secret: 'SEU_API_SECRET'
});
```

### 4️⃣ Executar o servidor

```bash
node api.js
```

A API rodará em:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Endpoints Disponíveis

### 👤 **Usuários**

| Método   | Rota                    | Descrição                       |
| -------- | ----------------------- | ------------------------------- |
| `POST`   | `/api/users`            | Criar um novo usuário           |
| `GET`    | `/api/users`            | Listar todos os usuários        |
| `GET`    | `/api/users/:id`        | Obter usuário por ID            |
| `POST`   | `/api/users/login`      | Login do usuário                |
| `PUT`    | `/api/users/:id`        | Atualizar nome/senha do usuário |
| `DELETE` | `/api/users/:id`        | Deletar usuário                 |
| `POST`   | `/api/users/:id/avatar` | Enviar avatar (imagem)          |

**Exemplo de criação:**

```bash
POST /api/users
{
  "name": "nykzx",
  "email": "dev@keyauthor.app",
  "pass": "123456"
}
```

---

### 🔑 **Licenças**

| Método   | Rota                                 | Descrição                            |
| -------- | ------------------------------------ | ------------------------------------ |
| `POST`   | `/api/licenses`                      | Criar nova licença                   |
| `POST`   | `/api/licenses/:licenseKey/validate` | Validar ou ativar uma licença        |
| `GET`    | `/api/licenses`                      | Listar todas as licenças             |
| `GET`    | `/api/licenses/user/:userId`         | Listar licenças de um usuário        |
| `PATCH`  | `/api/licenses/:licenseKey`          | Atualizar tipo ou duração de licença |
| `DELETE` | `/api/licenses/:licenseKey`          | Deletar licença                      |

**Exemplo de criação:**

```bash
POST /api/licenses
{
  "userId": "1",
  "durationDays": 30,
  "appTag": "KEYAUTH"
}
```

**Exemplo de validação:**

```bash
POST /api/licenses/KEYAUTH-AB123-CD456-EF789/validate
```

**Resposta:**

```json
{
  "valid": true,
  "status": "activated",
  "activatedAt": "2025-11-08T18:00:00Z",
  "expirationDate": "2025-12-08T18:00:00Z",
  "durationDays": 30
}
```

---

### 📱 **Aplicações**

| Método   | Rota                              | Descrição                                |
| -------- | --------------------------------- | ---------------------------------------- |
| `POST`   | `/api/applications`               | Criar nova aplicação (com imagem)        |
| `GET`    | `/api/applications`               | Listar todas as aplicações               |
| `GET`    | `/api/applications/:id`           | Obter uma aplicação por ID               |
| `DELETE` | `/api/applications/:id`           | Deletar aplicação                        |
| `PUT`    | `/api/applications/:appId/config` | Atualizar configurações de uma aplicação |

**Exemplo de configuração:**

```bash
PUT /api/applications/1/config
{
  "tag": "NEWAPP",
  "default_duration": 15
}
```

---

## 🎨 Interface e Tema

O **painel web** e o **aplicativo** seguem a identidade visual da marca **Key Author**:

* 🔴 **Cores primárias:** `#C70000` (vermelho principal)
* ⚫ **Cores secundárias:** tons neutros em cinza e branco
* 💠 **Logo:** ícone de chave + texto "KEY AUTHOR" em vermelho

Design moderno, minimalista e responsivo — projetado para dashboards administrativos.

---

## 🧠 Lógica de Funcionamento

1. **Usuário cria conta** → `POST /api/users`
2. **Usuário cria uma aplicação** → `POST /api/applications`
3. **Usuário gera licença** → `POST /api/licenses`
4. **Software cliente** valida a licença via API → `POST /api/licenses/:licenseKey/validate`
5. **API** ativa, renova ou expira a licença automaticamente.

---

## 🔐 Exemplo de Integração com Software (Node.js)

```js
async function validateLicense(licenseKey) {
  const res = await fetch(`http://localhost:3000/api/licenses/${licenseKey}/validate`, {
    method: "POST"
  });
  const data = await res.json();
  
  if (data.valid) {
    console.log("Licença válida até:", data.expirationDate);
  } else {
    console.log("Erro:", data.error);
  }
}

validateLicense("KEYAUTH-12345-ABCDE-FGHIJ");
```

---

## 📄 Licença

Distribuído sob a **MIT License**.
Sinta-se livre para modificar e usar o projeto.

---

## 💬 Contato

📧 **E-mail:** [contato@keyauthor.app](mailto:contato@keyauthor.app)
🌐 **Website:** [https://keyauthor.app](https://keyauthor.app)
🐙 **GitHub:** [github.com/keyauthor](https://github.com/keyauthor)

---

> “Proteja seu software, gerencie suas chaves e simplifique a autenticação.”
>
> — **Equipe Key Author 🔑**
