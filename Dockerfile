FROM node:18-alpine

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Copiar apenas os arquivos necessários primeiro
COPY package*.json ./
COPY tsconfig.json ./

# Configurar npm e instalar dependências
RUN npm config set legacy-peer-deps true \
    && npm config set strict-peer-deps false \
    && npm config set package-lock false \
    && npm config set audit false \
    && npm install

# Copiar o código fonte
COPY src ./src

# Compilar o TypeScript
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

# Expor porta
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 