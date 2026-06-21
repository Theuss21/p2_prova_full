# Usa uma imagem estável do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia arquivos de dependência e instala (usando npm ci para integridade/SHA512)
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Expõe a porta da API
EXPOSE 3000

# Comando para iniciar (Nota: no docker-compose usaremos o comando final)
CMD ["node", "src/app.js"]