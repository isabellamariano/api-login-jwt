# 🚀 API de Autenticação JWT (Node.js + Express)

Esta é uma API de autenticação desenvolvida com Node.js e TypeScript, utilizando JWT para Access Tokens e Cookies HttpOnly para Refresh Tokens.

---

## 🚀 Funcionalidades

- 🔐 **Login de Usuário:** Lista quem não retribuiu o seu follow.
- 📊 **Refresh Token:** Renovação automática do Access Token via cookies seguros.
- 🏃🏽 **Logout:** Encerramento de sessão com limpeza de cookies.
- 🙅🏽 **Rate Limiting:** Proteção contra ataques de força bruta.
- 📄 **Documentação:** Interface interativa via Swagger UI.

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)

## 📦 Instalação e Execução

Siga os passos abaixo para configurar o projeto localmente.

### 1. Clonar o repositório

Abra o seu terminal e digite:

```bash
git clone [https://github.com/isabellamariano/api-login-jwt.git](https://github.com/isabellamariano/api-login-jwt.git)
```

Entrar na pasta do projeto

```bash
cd api-login-jwt
```

Instalar as dependências

```bash
npm install
```

Configure as variáveis de ambiente: Crie um arquivo .env na raiz do projeto conforme o .env.example:

PORT=3000
HOST=http://localhost:4200
JWT_SECRET=sua_chave_secreta
REFRESH_TOKEN_SECRET=outra_chave_secreta

Iniciar o projeto

```bash
ng serve
```

## 📖 Documentação da API

Após iniciar o servidor, a documentação interativa estará disponível em: 👉 http://localhost:3000/api-docs<br/>
Lá você encontrará todos os endpoints, parâmetros necessários e exemplos de resposta.

## 📂 Estrutura de Pastas

├── src
│ ├── config # Constantes e utilitários<br/>
│ ├── controllers # Orquestração das requisições (req, res)<br/>
│ ├── interfaces # Definições de tipos e interfaces TypeScript<br/>
│ ├── middleware # Filtros, segurança e validadores<br/>
│ ├── models # Definições de schemas e interação direta com o banco<br/>
│ ├── routes # Definição dos caminhos da API e documentação Swagger<br/>
│ ├── services # Regras de negócio complexas e integração com APIs externas<br/>
│ ├── app.ts # Configuração central do Express<br/>
├── .env # Configurações sensíveis (Ignorado pelo Git)<br/>
├── .gitignore # Definição de arquivos que não vão para o repositório<br/>
├── server.ts # Ponto de entrada que inicia o servidor HTTP<br/>
└── tsconfig.json # Configurações do compilador TypeScript<br/>

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos abaixo:

1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua feature: `git checkout -b feature/NovaFeature`.
3. Dê um **Commit** nas suas alterações: `git commit -m 'Adicionando nova funcionalidade'`.
4. Dê um **Push** na sua Branch: `git push origin feature/NovaFeature`.
5. Abra um **Pull Request**.

Desenvolvido com 🍫🧃 **Isabella Mariano**
