# 🔗 Link Weaver

**Link Weaver** es un acortador de URLs moderno y completo, construido con tecnologías de vanguardia. Permite crear, gestionar y analizar enlaces cortos con una interfaz elegante y funcionalidades avanzadas.

## ✨ Características

- 🎯 **Acortamiento de URLs** con alias personalizados
- 📊 **Analytics en tiempo real** (clics, ubicaciones, dispositivos)
- 🔐 **Autenticación segura** con JWT
- 🎨 **Interfaz moderna** con modo oscuro
- ⚡ **Caché con Redis** para redirecciones ultra-rápidas
- 📱 **Responsive** - funciona en todos los dispositivos
- 🔒 **Rate limiting** para prevenir abuso

## 🏗️ Arquitectura

Este proyecto es un **monorepo** que contiene:

```
link-weaver/
├── backend/     # API REST con Node.js + Express + PostgreSQL + Redis
└── frontend/    # SPA con React + TypeScript + Vite + TailwindCSS
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Caché**: Redis
- **Autenticación**: JWT + Bcrypt
- **Validación**: Zod
- **Seguridad**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Charts**: Recharts

## 📋 Requisitos del Sistema

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **Redis** >= 6.x
- **npm** >= 9.x

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/link-weaver.git
cd link-weaver
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/linkweaver
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=tu-clave-super-secreta-de-al-menos-32-caracteres

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### 3. Configurar el Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

### Backend

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
npm test             # Ejecutar tests
```

### Frontend

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
```

## 🔧 Configuración de Producción

### Variables de Entorno Importantes

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=clave-segura-de-al-menos-32-caracteres
FRONTEND_URL=https://tu-dominio.com
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://api.tu-dominio.com/api
```

### Build de Producción

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Los archivos estarán en /dist
```

## 📚 Documentación Adicional

- [Backend README](./backend/README.md) - Detalles del API
- [Frontend README](./frontend/README.md) - Detalles de la interfaz
- [API Documentation](./backend/API_DOCS.md) - Endpoints disponibles

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Andrés Sánchez** - [GitHub](https://github.com/Sanchez042004)

## 🙏 Agradecimientos

- Inspirado en servicios como Bitly y TinyURL
- Construido con ❤️ usando tecnologías modernas
