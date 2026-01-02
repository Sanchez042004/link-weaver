# Configuración Render - Sin Redis

Este archivo `render.yaml` está configurado para desplegar **sin Redis** porque el plan gratuito de Render no soporta Redis en Blueprints.

## Opciones:

### Opción 1: Desplegar sin Redis (Recomendado para empezar)
El backend funcionará sin cache de Redis. Esto está bien para desarrollo y pruebas iniciales.

**Pasos:**
1. Sube este `render.yaml` a GitHub
2. Usa Blueprint en Render
3. Todo funcionará, solo sin cache

### Opción 2: Agregar Redis manualmente después
Si quieres Redis para mejor rendimiento:

1. **Despliega primero con el Blueprint actual**
2. **Crea Redis manualmente:**
   - En Render Dashboard → "New +" → "Redis"
   - Name: `link-weaver-redis`
   - Plan: Free
   - Region: Oregon
3. **Agrega la variable de entorno:**
   - Ve a tu Web Service → "Environment"
   - Agrega: `REDIS_URL` = `<Internal Redis URL>`
4. **Redespliega**

### Opción 3: Usar Upstash Redis (Gratis y mejor)
[Upstash](https://upstash.com) ofrece Redis gratis con mejor tier que Render:

1. Crea cuenta en Upstash.com
2. Crea una base de datos Redis
3. Copia la URL de conexión
4. Agrégala como variable de entorno `REDIS_URL` en Render

## Recomendación
Para empezar, usa **Opción 1** (sin Redis). Una vez que la app esté funcionando, puedes agregar Upstash Redis fácilmente.
