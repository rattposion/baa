# Backend da Aplicação de Gestão de Produção

Este é o backend da aplicação de gestão de produção, construído com Node.js, TypeScript, Express e MongoDB.

## Requisitos

- Node.js >= 18.0.0
- MongoDB
- npm ou yarn

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Configure as variáveis de ambiente no arquivo `.env`

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

## Build

Para criar a build de produção:

```bash
npm run build
```

## Testes

Para executar os testes:

```bash
npm test
```

## Deploy no Railway

1. Crie uma conta no [Railway](https://railway.app)
2. Crie um novo projeto
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente no Railway:
   - `PORT`: 3001
   - `NODE_ENV`: production
   - `MONGODB_URI`: sua URI do MongoDB
   - `JWT_SECRET`: sua chave secreta
   - `JWT_EXPIRES_IN`: 30d
   - `REFRESH_TOKEN_EXPIRES_IN`: 7d
   - `CORS_ORIGIN`: URL do seu frontend
   - `LOG_LEVEL`: info

5. O Railway detectará automaticamente o `Procfile` e iniciará a aplicação

## Scripts Disponíveis

- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm test`: Executa os testes
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código

## Estrutura do Projeto

```
src/
  ├── controllers/    # Controladores da aplicação
  ├── middleware/     # Middlewares
  ├── models/         # Modelos do MongoDB
  ├── routes/         # Rotas da API
  ├── services/       # Serviços
  ├── utils/          # Utilitários
  └── server.ts       # Arquivo principal
```

## Licença

ISC

## API Endpoints

### Autenticação
- POST `/api/auth/register` - Registrar novo usuário
- POST `/api/auth/login` - Login de usuário
- GET `/api/auth/profile` - Obter perfil do usuário (requer autenticação)

### Funcionários
- GET `/api/employees` - Listar funcionários (requer autenticação)
- GET `/api/employees/:id` - Obter funcionário por ID (requer autenticação)
- POST `/api/employees` - Criar funcionário (requer admin)
- PUT `/api/employees/:id` - Atualizar funcionário (requer admin)
- DELETE `/api/employees/:id` - Excluir funcionário (requer admin)

### Equipamentos
- GET `/api/equipment` - Listar equipamentos (requer autenticação)
- GET `/api/equipment/:id` - Obter equipamento por ID (requer autenticação)
- POST `/api/equipment` - Criar equipamento (requer admin)
- PUT `/api/equipment/:id` - Atualizar equipamento (requer admin)
- DELETE `/api/equipment/:id` - Excluir equipamento (requer admin)

### Produção
- GET `/api/production` - Listar registros de produção (requer autenticação)
- GET `/api/production/:id` - Obter registro de produção por ID (requer autenticação)
- POST `/api/production` - Criar registro de produção (requer autenticação)
- PUT `/api/production/:id` - Atualizar registro de produção (requer admin)
- DELETE `/api/production/:id` - Excluir registro de produção (requer admin)

### Movimentações
- GET `/api/movements` - Listar movimentações (requer autenticação)
- GET `/api/movements/:id` - Obter movimentação por ID (requer autenticação)
- POST `/api/movements` - Criar movimentação (requer autenticação)
- PUT `/api/movements/:id` - Atualizar movimentação (requer admin)
- DELETE `/api/movements/:id` - Excluir movimentação (requer admin)

## Segurança

- Todas as senhas são hasheadas usando bcrypt
- Autenticação usando JWT
- Rate limiting para prevenir ataques de força bruta
- Headers de segurança usando Helmet
- CORS configurado para permitir apenas origens específicas
- Validação de dados em todas as rotas 