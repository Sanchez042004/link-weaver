# 🚀 Guía de Despliegue - Link Weaver

Esta guía te llevará paso a paso para desplegar tu aplicación en producción.

---

## 📋 Requisitos Previos

1. ✅ Cuenta en [GitHub](https://github.com)
2. ✅ Cuenta en [Render.com](https://render.com) (gratis)
3. ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
4. ✅ Tu código subido a GitHub

---

---

## ☁️ PASO 1.5: Desplegar Backend en Back4App (Alternativa 24/7 Sin Tarjeta)

Si prefieres una opción que no pida tarjeta de crédito y sea 24/7:

1. **Ve a [Back4App Containers](https://www.back4app.com/products/containers)**
2. **Conecta tu cuenta de GitHub** e importa este repositorio.
3. **Configuración del Contenedor:**
   - **Root Directory:** `backend`
   - **Dockerfile Path:** `./Dockerfile` (Back4App lo buscará dentro de `backend/`)
4. **Variables de Entorno (Environment Variables):**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://... (Tu URL de Postgres)
   REDIS_URL=redis://... (Tu URL de Redis)
   JWT_SECRET=<genera-un-string-seguro>
   FRONTEND_URL=https://tu-app.vercel.app
   ```
5. **Click en "Deploy"**

---

## 🗄️ PASO 1: Desplegar Backend en Render

### Opción A: Despliegue Automático (Recomendado)

1. **Sube el archivo `render.yaml` a tu repositorio de GitHub**
   ```bash
   git add render.yaml
   git commit -m "Add Render configuration"
   git push
   ```

2. **Ve a [Render Dashboard](https://dashboard.render.com)**

3. **Click en "New +" → "Blueprint"**

4. **Conecta tu repositorio de GitHub**

5. **Render detectará automáticamente el `render.yaml` y creará:**
   - ✅ PostgreSQL Database
   - ✅ Redis Instance
   - ✅ Web Service (Backend API)

6. **Configura la variable de entorno `FRONTEND_URL`:**
   - Por ahora déjala como está
   - La actualizaremos después de desplegar el frontend

7. **Click en "Apply"** y espera a que se complete el despliegue (5-10 minutos)

8. **Copia la URL de tu backend** (algo como `https://link-weaver-api.onrender.com`)

### Opción B: Despliegue Manual

Si prefieres configurar manualmente:

#### 1. Crear PostgreSQL Database
1. En Render Dashboard → "New +" → "PostgreSQL"
2. Name: `link-weaver-db`
3. Database: `linkweaver`
4. User: `linkweaver`
5. Region: Oregon (Free)
6. Click "Create Database"
7. **Guarda la "Internal Database URL"**

#### 2. Crear Redis Instance
1. En Render Dashboard → "New +" → "Redis"
2. Name: `link-weaver-redis`
3. Region: Oregon (Free)
4. Click "Create Redis"
5. **Guarda la "Internal Redis URL"**

#### 3. Crear Web Service (Backend)
1. En Render Dashboard → "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name:** `link-weaver-api`
   - **Region:** Oregon (Free)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Variables de Entorno:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<tu-internal-database-url>
   REDIS_URL=<tu-internal-redis-url>
   JWT_SECRET=<genera-un-string-aleatorio-seguro>
   FRONTEND_URL=https://link-weaver.vercel.app
   ```

5. Click "Create Web Service"

---

## 🎨 PASO 2: Desplegar Frontend en Vercel

1. **Ve a [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click en "Add New..." → "Project"**

3. **Importa tu repositorio de GitHub**

4. **Configuración del Proyecto:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Variables de Entorno:**
   ```
   VITE_API_URL=https://link-weaver-api.onrender.com
   ```
   ⚠️ **Importante:** Usa la URL de tu backend de Render (sin `/` al final)

6. **Click en "Deploy"**

7. **Espera a que termine el despliegue** (2-3 minutos)

8. **Copia la URL de tu frontend** (algo como `https://link-weaver.vercel.app`)

---

## 🔄 PASO 3: Actualizar CORS en el Backend

1. **Ve a tu Web Service en Render**

2. **Actualiza la variable `FRONTEND_URL`** con tu URL real de Vercel:
   ```
   FRONTEND_URL=https://tu-app.vercel.app
   ```

3. **Guarda los cambios** (Render redesplegará automáticamente)

---

## ✅ PASO 4: Verificar el Despliegue

1. **Abre tu aplicación en Vercel**
2. **Prueba crear una cuenta**
3. **Prueba acortar un enlace**
4. **Verifica que todo funcione correctamente**

---

## 🐛 Solución de Problemas

### El backend no inicia
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Render Dashboard → Tu servicio → "Logs"
- Asegúrate de que la base de datos esté activa

### Error de CORS
- Verifica que `FRONTEND_URL` en Render coincida exactamente con tu URL de Vercel
- No incluyas `/` al final de las URLs

### El frontend no se conecta al backend
- Verifica que `VITE_API_URL` en Vercel apunte a tu backend de Render
- Asegúrate de que el backend esté corriendo (visita `https://tu-backend.onrender.com/health`)

### Base de datos no conecta
- Usa la "Internal Database URL" de Render, no la "External"
- Verifica que el formato sea correcto: `postgresql://user:password@host:port/database`

---

## 📝 Notas Importantes

### Tier Gratuito de Render
- ⚠️ El servicio gratuito "duerme" después de 15 minutos de inactividad
- ⏱️ La primera petición después de dormir tardará ~30 segundos
- 💡 Solución: Usa un servicio como [UptimeRobot](https://uptimerobot.com) para hacer ping cada 10 minutos

### Actualizaciones
- **Frontend:** Vercel redespliega automáticamente en cada push a `main`
- **Backend:** Render redespliega automáticamente en cada push a `main`

### Dominios Personalizados
- Tanto Vercel como Render permiten agregar dominios personalizados gratis
- Ve a la configuración del proyecto → "Domains"

---

## 🎉 ¡Listo!

Tu aplicación ahora está en producción y accesible desde cualquier parte del mundo.

**URLs de ejemplo:**
- Frontend: `https://link-weaver.vercel.app`
- Backend: `https://link-weaver-api.onrender.com`
- API Health: `https://link-weaver-api.onrender.com/health`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render y Vercel
2. Verifica las variables de entorno
3. Asegúrate de que las URLs no tengan `/` al final
