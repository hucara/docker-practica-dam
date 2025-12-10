# Imagen base de Nginx Alpine
FROM nginx:alpine

# Eliminar la configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestra configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Copiar los archivos del frontend
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Puerto que expone el contenedor
EXPOSE 80

# Nginx se ejecuta en primer plano
CMD ["nginx", "-g", "daemon off;"]
