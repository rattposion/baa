FROM node:18-alpine

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Remover devDependencies
RUN npm prune --production

# Expor porta
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 