# ---- Stage 1: build da aplicação React com Vite ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: serve dos arquivos estáticos com Nginx ----
FROM nginx:1.27-alpine

# Configuração do Nginx (SPA: todas as rotas caem em index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script que gera public/env-config.js com base na variável de ambiente
# API_URL no momento em que o container sobe (não no build da imagem)
COPY docker-entrypoint.sh /docker-entrypoint.d/30-env-config.sh
RUN chmod +x /docker-entrypoint.d/30-env-config.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# A imagem oficial do Nginx já executa automaticamente os scripts
# em /docker-entrypoint.d/*.sh antes de iniciar o servidor.
