# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para Prisma y builds
RUN apk add --no-cache openssl libc6-compat

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma y compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Instalar dependencias de runtime necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Copiar archivos necesarios desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.prod.json ./

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
