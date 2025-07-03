# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias y react-dropzone
RUN npm install && npm install react-dropzone

# Copiar el resto de los archivos
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]