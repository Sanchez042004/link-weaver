import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '@/config/env';
import { redirectController } from '@/container';
import { globalErrorHandler, notFoundHandler } from '@/middlewares/error.middleware';

/**
 * Configuración de la aplicación Express
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

// Configuración de Proxy (Crítico para PaaS como Back4App)
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Confiar en el primer proxy (el de Back4App)
}

// Ruta de bienvenida
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Bienvenido a la API de Link Weaver',
        version: '1.0.0',
        status: 'online'
    });
});

// Health check para monitoreo de despliegue
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'link-weaver-backend'
    });
});

// LOG DE ORIGEN (Para depurar CORS)
app.use((req, res, next) => {
    if (req.method === 'OPTIONS' || req.headers.origin) {
        console.log(`[CORS_DEBUG] Method: ${req.method} | Origin: ${req.headers.origin} | Path: ${req.path}`);
    }
    next();
});

app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigin = env.FRONTEND_URL.replace(/\/$/, '');
            // Permitir si no hay origin (mismo servidor), coincide exacto, o coincide sin barra final
            if (!origin || origin.replace(/\/$/, '') === allowedOrigin) {
                callback(null, true);
            } else {
                console.warn(`[CORS_BLOCKED] Origin "${origin}" not allowed by config "${allowedOrigin}"`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
);

app.use(express.json({ limit: '10mb' })); // Límite de 10MB para JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Rutas base movidas al principio

// Ruta raíz movida arriba ^

/**
 * ============================================
 * MANEJO DE ERRORES
 * ============================================
 */

// Redirección de URLs cortas (ej: /xyz123)
app.get('/:alias', redirectController.redirect);

/**
 * 404 - Not Found Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler Global
 */
app.use(globalErrorHandler);
