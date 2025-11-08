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

## Tecnologias

| Back-end | Front-end | App |
|----------|-----------|-----|
| Node.js | HTML5 | C# |
| Express.js | CSS3 | XAML |
| | JavaScript | |
| | Fetch API | |

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
| POST | `/api/users` | Criar usuário |
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Buscar usuário |
| POST | `/api/users/login` | Login |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |
| POST | `/api/users/:id/avatar` | Upload avatar |

## Licenças
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/licenses` | Criar licença |
| POST | `/api/licenses/:licenseKey/validate` | Validar licença |
| GET | `/api/licenses` | Listar licenças |
| GET | `/api/licenses/user/:userId` | Licenças do usuário |
| PATCH | `/api/licenses/:licenseKey` | Atualizar licença |
| DELETE | `/api/licenses/:licenseKey` | Deletar licença |

## Aplicações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/applications` | Criar aplicação |
| GET | `/api/applications` | Listar aplicações |
| GET | `/api/applications/:id` | Buscar aplicação |
| DELETE | `/api/applications/:id` | Deletar aplicação |
| PUT | `/api/applications/:appId/config` | Atualizar configurações |

---

## 🧑‍💻 Autor

Desenvolvido por [**Luis Fernando**](https://github.com/akoows), [**Bruno Santana**](https://github.com/voante10), [**Giovana Almeida**](https://www.instagram.com/giyy_allst) e [**Breno Ledo**](https://www.instagram.com/l3do.uwu) 
💼 Projeto: **Key Author**  
🔗 Repositório: [github.com/akoows/key-auther](https://github.com/akoows/key-auther)

---

> 🔒 **Key Auther** — Segurança, simplicidade e poder em um sistema de autenticação via API.
