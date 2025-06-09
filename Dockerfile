FROM node:18-alpine

# Instalar dependências necessárias para compilação e healthcheck
RUN apk add --no-cache python3 make g++ curl

WORKDIR /app

# Configurar npm
RUN npm config set legacy-peer-deps true \
    && npm config set strict-peer-deps false \
    && npm config set package-lock false \
    && npm config set audit false

# Copiar apenas os arquivos necessários primeiro
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY src ./src

# Compilar o TypeScript
RUN npm run build

# Remover dependências de desenvolvimento
RUN npm prune --production

# Configurar healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Expor porta
EXPOSE 5000

# Configurar variáveis de ambiente padrão
ENV NODE_ENV=production \
    PORT=5000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 