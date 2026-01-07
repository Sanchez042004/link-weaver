# ⚙️ Knot.ly - Backend API

Esta es la capa lógica central de Knot.ly, diseñada bajo principios de arquitectura limpia y optimizada para el procesamiento de redirecciones a escala.

## 🏗️ Decisión de Arquitectura: Service-Based Layering

El backend utiliza un patrón de capas para asegurar que la lógica de negocio permanezca desacoplada de los detalles de implementación:

1.  **Controllers**: Manejan exclusivamente la entrada/salida HTTP y la orquestación básica.
2.  **Services**: Contienen la lógica de negocio pura (ej. generación de alias, validación de cuotas).
3.  **Middlewares**: Encargados de la seguridad (JWT), validación de esquemas (Zod) y manejo global de errores.
4.  **Config**: Centralización de conexiones a PostgreSQL (vía Prisma).

## ⚡ Optimización de Base de Datos

Para maximizar el throughput de redirecciones, implementé una estrategia de indexación y consultas optimizadas:

```typescript
// Lógica conceptual del servicio de redirección
async function getUrl(alias: string) {
  // Consulta optimizada con índice único en el campo 'alias'
  const url = await prisma.url.findUnique({ 
    where: { alias },
    select: { longUrl: true, id: true }
  });
  
  if (!url) throw new NotFoundError('URL no encontrada');
  
  // Registro asíncrono de analytics sin bloquear la respuesta
  await analyticsService.trackClick(url.id);
  
  return url;
}
```

## 🔒 Seguridad y Resiliencia

-   **Rate Limiting**: Implementado para mitigar ataques de fuerza bruta en la creación de enlaces y proteger los recursos del servidor.
-   **Zod Schema Validation**: Validación estricta en tiempo de ejecución para asegurar la integridad de los datos entrantes.
-   **JWT Stateless Auth**: Manejo de sesiones eficiente sin necesidad de persistencia en servidor.

## 🛠️ Tecnologías Nucleares

-   **Runtime**: Node.js + TypeScript
-   **ORM**: Prisma (Type-safe database access)
-   **Database**: PostgreSQL
-   **Testing**: Vitest (Unit & Integration testing)

## 📦 Scripts de Desarrollo

El backend está configurado para un ciclo de desarrollo ágil:

```bash
npm run dev          # Desarrollo con Hot-Reload
npm run build        # Transpilación a JS plano para producción
npm run prisma:migrate # Sincronización de esquema con la DB
npm test             # Ejecución de la suite de pruebas
```

---
> [!TIP]
> Para una referencia detallada de todos los endpoints disponibles y cómo probarlos, consulta [API_DOCS.md](./API_DOCS.md).

