FROM node:18-alpine

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Configurar npm
RUN npm config set legacy-peer-deps true \
    && npm config set strict-peer-deps false \
    && npm config set package-lock false \
    && npm config set audit false

# Copiar todo o código fonte primeiro
COPY . .

# Instalar dependências e compilar
RUN npm install \
    && npm run build \
    && npm prune --production

# Expor porta
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "start"] 