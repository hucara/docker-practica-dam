# Imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Copiar el código fuente
COPY . .

# El puerto que expondrá el contenedor
EXPOSE 3000

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
USER nodeuser

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
