# Etapa 1: Construção
FROM node:22.11.0 AS build

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos de configuração e dependências
COPY package.json package-lock.json tsconfig.json vite.config.* ./

# Instale as dependências
RUN npm install

# Copie todo o restante do projeto
COPY . .

# Execute o build com Vite
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copie os arquivos buildados para o Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
