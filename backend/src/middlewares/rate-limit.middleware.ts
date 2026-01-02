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
    max: 1000, // Máximo 1000 intentos (efectivamente deshabilitado para uso normal)
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Por favor intenta nuevamente en 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

/**
 * Limitador Global
 * Aplica a todas las rutas de la API
 */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10000, // 10000 requests por ventana (muy permisivo)
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});
