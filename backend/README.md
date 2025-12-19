# 🔗 Link Weaver - Backend API

Backend para el acortador de URLs Link Weaver, construido con Node.js, Express, TypeScript, PostgreSQL y Redis.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Luego edita `.env` y ajusta los valores según tu configuración local:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/linkweaver
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu-clave-super-secreta-de-al-menos-32-caracteres
```

### 3. Instalar PostgreSQL

**Windows:**
- Descarga desde: https://www.postgresql.org/download/windows/
- Durante la instalación, recuerda la contraseña del usuario `postgres`
- Por defecto corre en el puerto 5432

**Verificar instalación:**
```bash
psql --version
```

### 4. Instalar Redis

**Windows:**
- Descarga desde: https://github.com/microsoftarchive/redis/releases
- O usa Docker: `docker run -d -p 6379:6379 redis`

**Verificar instalación:**
```bash
redis-cli ping
# Debe responder: PONG
```

### 5. Crear la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE linkweaver;

# Salir
\q
```

### 6. Generar Cliente de Prisma y Ejecutar Migraciones

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Crear y aplicar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver la DB
npm run prisma:studio
```

### 7. Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# El servidor estará en: http://localhost:3001
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (DB, Redis, env)
│   ├── controllers/     # Controladores de rutas
│   ├── services/        # Lógica de negocio
│   ├── middlewares/     # Middlewares (auth, validación, etc.)
│   ├── routes/          # Definición de rutas
│   ├── utils/           # Utilidades (Base62, etc.)
│   ├── types/           # Tipos TypeScript
│   ├── app.ts           # Configuración de Express
│   └── server.ts        # Punto de entrada
├── prisma/
│   └── schema.prisma    # Schema de la base de datos
├── .env                 # Variables de entorno (NO commitear)
├── .env.example         # Template de variables de entorno
├── tsconfig.json        # Configuración TypeScript
└── package.json         # Dependencias y scripts
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia servidor en modo desarrollo
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta servidor compilado (producción)
- `npm run prisma:generate` - Genera cliente de Prisma
- `npm run prisma:migrate` - Crea y aplica migraciones
- `npm run prisma:studio` - Abre interfaz gráfica de la DB
- `npm run prisma:push` - Sincroniza schema sin migración

## 🔧 Tecnologías

- **Node.js** + **Express** - Framework web
- **TypeScript** - Type safety
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM moderno
- **Redis** - Caché en memoria
- **JWT** - Autenticación
- **Bcrypt** - Hashing de contraseñas
- **Zod** - Validación de datos

## 📝 Próximos Pasos

Una vez configurado el entorno, continuaremos implementando:

1. ✅ Configuración base (completado)
2. ⏳ Sistema de autenticación
3. ⏳ Servicio de acortamiento de URLs
4. ⏳ Servicio de redirección
5. ⏳ Sistema de caché con Redis
6. ⏳ Analytics y estadísticas
7. ⏳ Seguridad y rate limiting

## ❓ Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Error: "Redis connection failed"
Verifica que Redis esté corriendo:
```bash
redis-cli ping
```

### Error: "PostgreSQL connection failed"
Verifica que PostgreSQL esté corriendo y que el `DATABASE_URL` en `.env` sea correcto.

## 📚 Recursos

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de Redis](https://redis.io/docs/)
