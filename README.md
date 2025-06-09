# Backend do Sistema de Gestão de Produção

Este é o backend do sistema de gestão de produção, desenvolvido com Node.js, Express, TypeScript e MongoDB.

## Requisitos

- Node.js 18+
- MongoDB
- NPM ou Yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mix_production
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## Desenvolvimento

Para rodar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

## Build

Para gerar o build de produção:

```bash
npm run build
```

## Produção

Para rodar o servidor em produção:

```bash
npm start
```

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

## Deploy no Railway

1. Crie uma conta no Railway (https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no Railway:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. O Railway irá detectar automaticamente o `package.json` e executar os scripts necessários

## Segurança

- Todas as senhas são hasheadas usando bcrypt
- Autenticação usando JWT
- Rate limiting para prevenir ataques de força bruta
- Headers de segurança usando Helmet
- CORS configurado para permitir apenas origens específicas
- Validação de dados em todas as rotas 