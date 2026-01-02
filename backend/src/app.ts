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

// 🟢 NIVEL 0: DIAGNÓSTICO SENIOR (Antes de cualquier middleware)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] >>> INCOMING: ${req.method} ${req.url}`);
    console.log(`[${timestamp}] HEADERS_DEBUG: ${JSON.stringify(req.headers)}`);

    res.on('finish', () => {
        console.log(`[${timestamp}] <<< OUTGOING: ${req.method} ${req.url} | STATUS: ${res.statusCode}`);
    });
    next();
});

// 🟢 NIVEL 1: RESPUESTAS DE SALUD PURAS (Sin interferencia de Helmet/CORS)
app.all(['/', '/health', '/api/health', '/api'], (req, res) => {
    console.log(`[${new Date().toISOString()}] ✅ HIT_HEALTH_CHECK: ${req.method} ${req.path}`);
    res.status(200).send('OK_ALIVE'); // Respuesta minimalista y ultra-compatible
});

/**
 * ============================================
 * MIDDLEWARES GLOBALES (Ahora debajo de Salud)
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
