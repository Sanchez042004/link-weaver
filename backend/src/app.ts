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

// 🟢 NIVEL 0: BYPASS DE SALUD Y DIAGNÓSTICO (Intercepta antes que NADIE)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();

    // Rutas de salud críticas para que el Gateway abra el tráfico
    const healthPaths = ['/', '/health', '/api/health', '/api'];
    if (healthPaths.includes(req.path)) {
        console.log(`[${timestamp}] 💉 Nivel 0: HEALTH_CHECK_RESPONSE: ${req.method} ${req.path}`);
        res.status(200)
            .set('Content-Type', 'text/plain')
            .set('Connection', 'close') // Evitar keep-alive en health checks
            .send('OK_ALIVE');
        return; // IMPORTANTE: No llama a next(), termina aquí el proceso
    }

    // Diagnóstico para el resto de rutas (Auth, URLs, etc)
    console.log(`[${timestamp}] >>> INCOMING: ${req.method} ${req.url}`);
    console.log(`[${timestamp}] HEADERS_DEBUG: ${JSON.stringify(req.headers)}`);

    res.on('finish', () => {
        console.log(`[${timestamp}] <<< OUTGOING: ${req.method} ${req.url} | STATUS: ${res.statusCode}`);
    });
    next();
});

// Rutas de salud de Nivel 1 eliminadas (ya se manejan arriba)

/**
 * ============================================
 * MIDDLEWARES GLOBALES
 * ============================================
 */

app.use(helmet({
    contentSecurityPolicy: false, // Desactivar temporalmente para evitar bloqueos
}));

// Configuración de Proxy (Crítico para PaaS como Back4App)
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Confiar en el primer proxy (el de Back4App)
}

// Rutas de salud movidas arriba ^

app.use(
    cors({
        origin: env.FRONTEND_URL, // Solo permitir requests desde el frontend
        credentials: true, // Permitir cookies/auth headers
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
