import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';

/**
 * Middleware para autenticación opcional
 * 
 * Si hay token, lo valida y adjunta el usuario.
 * Si no hay token o es inválido, continúa sin error (usuario anónimo).
 */
export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = AuthService.verifyToken(token);
        req.user = payload;
    } catch (error) {
        // Si el token es inválido, simplemente lo ignoramos y tratamos como anónimo
        // Opcionalmente podríamos loguear advertencia
    }

    next();
};
