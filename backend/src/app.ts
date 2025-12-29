import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '@/config/env';
import { RedirectController } from '@/controllers/redirect.controller';
import { globalLimiter } from '@/middlewares/rate-limit.middleware';
import { globalErrorHandler, notFoundHandler } from '@/middlewares/error.middleware';

// Leer versión desde package.json
import packageJson from '../package.json';

/**
 * Configuración de la aplicación Express
 * // ... (docs)
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

app.use(helmet());

// Configuración de Proxy (Crítico para Rate Limit y Analytics detrás de Nginx/Cloudflare)
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(
    cors({
        origin: env.FRONTEND_URL, // Solo permitir requests desde el frontend
        credentials: true, // Permitir cookies/auth headers
    })
);

app.use(express.json({ limit: '10mb' })); // Límite de 10MB para JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Aplicar rate limiting a todas las rutas
app.use(globalLimiter);

/**
 * ============================================
 * RUTAS
 * ============================================
 */

import { authRoutes } from '@/routes/auth.routes';
import { urlRoutes } from '@/routes/url.routes';
import { analyticsRoutes } from '@/routes/analytics.routes';
import { userRoutes } from '@/routes/user.routes';

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

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
        version: packageJson.version, // Dinámico
        documentation: '/api/docs', // Futuro: Swagger/OpenAPI
    });
});

/**
 * ============================================
 * MANEJO DE ERRORES
 * ============================================
 */

// Redirección de URLs cortas (ej: /xyz123)
app.get('/:alias', RedirectController.redirect);

/**
 * 404 - Not Found Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler Global
 */
app.use(globalErrorHandler);

