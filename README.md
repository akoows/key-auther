# 🔑 KEY AUTHOR

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

| Back-end | Front-end | App |
|----------|-----------|-----|
| Node.js | HTML5 | C# |
| Express.js | CSS3 | XAML |
| | JavaScript | |
| Prisma 6.0 | Fetch API | |

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

## Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /users/ | Criar usuário |
| GET | `/users/` | Listar usuários |
| GET | `/users/:id` | Buscar usuário |
| POST | `/api/users/login` | Login |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Deletar usuário |
| POST | `/users/:id/avatar` | Upload avatar |

## Licenças
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/licenses` | Criar licença |
| POST | `/licenses/:licenseKey/validate` | Validar licença |
| GET | `/licenses` | Listar licenças |
| GET | `/licenses/user/:userId` | Licenças do usuário |
| PATCH | `/licenses/:licenseKey` | Atualizar licença |
| DELETE | `/licenses/:licenseKey` | Deletar licença |

## Aplicações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/applications` | Criar aplicação |
| GET | `/applications` | Listar aplicações |
| GET | `/applications/:id` | Buscar aplicação |
| DELETE | `/applications/:id` | Deletar aplicação |
| PUT | `/applications/:appId/config` | Atualizar configurações |

---

## 🧑‍💻 Autor

Desenvolvido por [**Luis Manduca**](https://github.com/akoows) 

💼 Site: [**Key Author**](https://akoows.github.io/keyauthor)  

---

> 🔒 **Key Author** — Segurança, simplicidade e poder em um sistema de autenticação via API.
