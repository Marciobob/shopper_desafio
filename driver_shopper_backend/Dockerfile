# Escolha a imagem do Node.js como base
FROM node:22.11.0

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos do projeto para o contêiner
COPY . .

# Instale as dependências
RUN npm install

# Compile o código TypeScript
RUN npm run build

# Comando para iniciar o aplicativo
CMD ["node", "dist/server.js"]
