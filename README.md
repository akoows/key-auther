# 🔑 Key Auther

Sistema completo de **autenticação e validação de chaves de licença** via **API e painel web**, desenvolvido para facilitar o controle de acessos, distribuição de licenças e integração com aplicações externas.

---

## 🚀 Visão Geral

O **Key Author** permite que você gere, valide e gerencie licenças de software de forma simples e segura.

O sistema é composto por:
- **API RESTful** para autenticação e validação de chaves  
- **Painel Web** para administração de licenças, usuários e configurações  
- **Integração com aplicativos** externos via endpoints seguros  

---

## 🧰 Tecnologias Utilizadas

**Back-end:**
- Node.js
- Express.js

**Front-end:**
- HTML5, CSS3 e JavaScript
- Fetch API para comunicação com a API

---

## ⚙️ Funcionalidades Principais

✅ Registro e login de usuários  
✅ Geração de chaves de licença com duração configurável  
✅ Validação de licenças via API (`/api/licenses/:licenseKey/validate`)  
✅ Controle de expiração e ativação de licenças  
✅ Painel administrativo com gerenciamento de licenças  
✅ Configuração personalizada de tags e duração padrão das licenças  

---

## 📡 Endpoints da API

### 🔍 Validar Licença
`POST /api/licenses/:licenseKey/validate`

**Request:**
```json
{
  "appId": "id_da_aplicacao"
}
```

**Response:**
```json
{
  "valid": true,
  "license": {
    "key": "XXXX-XXXX-XXXX",
    "expiresAt": "2025-12-01T00:00:00Z"
  }
}
```

**Erros possíveis:**
- `404` – Licença não encontrada  
- `403` – Licença expirada  
- `400` – Dados inválidos  

---

## 🧑‍💻 Autor

Desenvolvido por [**Luis Fernando**](https://github.com/akoows), [**Bruno Santana**](https://github.com/voante10)  
💼 Projeto: **Key Author**  
🔗 Repositório: [github.com/akoows/key-auther](https://github.com/akoows/key-auther)

---

> 🔒 **Key Auther** — Segurança, simplicidade e poder em um sistema de autenticação via API.
