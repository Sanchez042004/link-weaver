import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { env } from '@/config/env';
import { RedirectController } from '@/controllers/redirect.controller';

/**
 * Configuración de la aplicación Express
 * 
 * Este archivo configura todos los middlewares globales,
 * rutas, y manejo de errores de la aplicación.
 */

/**
 * Crear instancia de Express
 */
export const app: Application = express();

/**
 * ============================================
 * MIDDLEWARES GLOBALES
 * ============================================
 */

/**
 * 1. Helmet - Seguridad HTTP Headers
 * 
 * Protege la app configurando varios headers HTTP:
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection: 1; mode=block
 * - Etc.
 */
app.use(helmet());

/**
 * 2. CORS - Cross-Origin Resource Sharing
 * 
 * Permite que el frontend (en otro puerto/dominio) 
 * pueda hacer peticiones a este backend.
 */
app.use(
    cors({
        origin: env.FRONTEND_URL, // Solo permitir requests desde el frontend
        credentials: true, // Permitir cookies/auth headers
    })
);

/**
 * 3. Body Parsers
 * 
 * Parsean el body de las peticiones HTTP:
 * - express.json(): Para peticiones con Content-Type: application/json
 * - express.urlencoded(): Para peticiones con formularios
 */
app.use(express.json({ limit: '10mb' })); // Límite de 10MB para JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * 4. Rate Limiting
 * 
 * Limita el número de peticiones por IP para prevenir:
 * - Ataques de fuerza bruta
 * - DDoS
 * - Abuso de la API
 */
const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS, // Ventana de tiempo (15 min por defecto)
    max: env.RATE_LIMIT_MAX_REQUESTS, // Máximo de requests por ventana (100 por defecto)
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
    standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
    legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
});

// Aplicar rate limiting a todas las rutas
app.use(limiter);

/**
 * ============================================
 * RUTAS
 * ============================================
 */

/**
 * Ruta de health check
 * 
 * Útil para verificar que el servidor está funcionando
 * y para load balancers / monitoring tools
 */
import { authRoutes } from '@/routes/auth.routes';
import { urlRoutes } from '@/routes/url.routes';
import { analyticsRoutes } from '@/routes/analytics.routes';

// ... (después de los middlewares y antes de las rutas existentes)

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Rutas base
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
    });
});

/**
 * Ruta raíz
 */
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Link Weaver API',
        version: '1.0.0',
        documentation: '/api/docs', // Futuro: Swagger/OpenAPI
    });
});

/**
 * TODO: Importar y usar las rutas de la aplicación
 * 
 * app.use('/api/auth', authRoutes);
 * app.use('/api/urls', urlRoutes);
 * app.use('/', redirectRoutes); // Para las redirecciones /:alias
 */

/**
 * ============================================
 * MANEJO DE ERRORES
 * ============================================
 */

// Redirección de URLs cortas (ej: /xyz123)
app.get('/:alias', RedirectController.redirect);

/**
 * 404 - Not Found Handler
 * Si llegamos aquí y no coincidió con ninguna ruta anterior (incluyendo /:alias)
 * significa que es una ruta no manejada.
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `La ruta ${req.method} ${req.path} no existe`,
        timestamp: new Date().toISOString(),
    });
});

/**
 * Error Handler Global
 * 
 * Captura todos los errores que ocurran en la aplicación
 * y devuelve una respuesta JSON consistente
 */
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // Log del error (en producción, esto iría a un servicio de logging)
    console.error('Error:', err);

    // Determinar status code
    const statusCode = err.statusCode || err.status || 500;

    // Determinar mensaje de error
    const message =
        env.NODE_ENV === 'production'
            ? 'Ocurrió un error en el servidor' // En producción, no revelar detalles
            : err.message || 'Internal Server Error'; // En desarrollo, mostrar detalles

    // Responder con error
    res.status(statusCode).json({
        error: err.name || 'Error',
        message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }), // Stack trace solo en desarrollo
        timestamp: new Date().toISOString(),
    });
});
