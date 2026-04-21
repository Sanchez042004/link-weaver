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
 * MIDDLEWARES GLOBALES Y SEGURIDAD
 * ============================================
 */

app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigin = env.FRONTEND_URL.replace(/\/$/, '');
            if (!origin || origin.replace(/\/$/, '') === allowedOrigin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
    })
);

// Configuración de Proxy (Crítico para PaaS como Back4App)
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Body Parsers con límites de seguridad
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

/**
 * ============================================
 * RUTAS BASE Y MONITOREO
 * ============================================
 */

app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Bienvenido a la API de Link Weaver',
        version: '1.0.0',
        status: 'online'
    });
});

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'link-weaver-backend'
    });
});

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
