# 🐳 Práctica Docker - Tienda DAM

Proyecto de práctica para el Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM).

## 📋 Descripción

Aplicación de tienda online con arquitectura de tres capas:
- **Frontend**: Interfaz web con HTML, CSS y JavaScript, servida por Nginx
- **Backend**: API REST con Node.js y Express
- **Database**: Base de datos MySQL 8.0

## 🏗️ Arquitectura

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │ ──── │   Backend   │ ──── │   MySQL     │
│   (Nginx)   │      │  (Node.js)  │      │  Database   │
│   :8080     │      │   :3000     │      │   :3306     │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🚀 Inicio Rápido

### Requisitos
- Docker instalado
- Docker Compose instalado

### Ejecutar

```bash
# Clonar o descargar el proyecto
cd docker-practica

# Construir y levantar los contenedores
docker-compose up --build

# O en segundo plano
docker-compose up --build -d
```

### Acceder a la aplicación

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3000 |
| Health Check | http://localhost:3000/api/health |

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información de la API |
| GET | `/api/health` | Estado de salud |
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Obtener producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |
| GET | `/api/usuarios` | Listar usuarios |

## 🛠️ Comandos Útiles

```bash
# Ver contenedores en ejecución
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar contenedores
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reconstruir
docker-compose build --no-cache

# Acceder a MySQL
docker exec -it tienda-database mysql -u root -prootpassword tienda

# Acceder al backend
docker exec -it tienda-backend sh
```

## 📁 Estructura del Proyecto

```
docker-practica/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
└── database/
    └── init.sql
```

## 👨‍🎓 Autor

Práctica realizada para el módulo de Desarrollo de Aplicaciones Multiplataforma (DAM)

## 📄 Licencia

Proyecto educativo - Uso libre para fines académicos
