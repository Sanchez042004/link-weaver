import { rateLimit } from 'express-rate-limit';
import { env } from '@/config/env';

/**
 * Limitador para rutas de autenticación (Login/Register)
 * 
 * Más estricto que el limitador global para prevenir:
 * - Ataques de fuerza bruta a contraseñas
 * - Enumeración de usuarios
 * - Spam de cuentas
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 intentos por IP cada 15 min
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Por favor intenta nuevamente en 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Opcional: no contar logins exitosos (para evitar bloquear usuarios legítimos que se equivoquen un par de veces)
});

/**
 * Limitador Global
 * Aplica a todas las rutas de la API
 */
export const globalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS, // Ventana de tiempo
    max: env.RATE_LIMIT_MAX_REQUESTS, // Máximo de requests por ventana
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
    standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
    legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
});
