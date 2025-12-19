import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'Token de autenticación no proporcionado',
            });
            return;
        }

        // Formato esperado: "Bearer <token>"
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({
                success: false,
                message: 'Formato de token inválido (se esperaba "Bearer <token>")',
            });
            return;
        }

        const token = parts[1];

        // Verificar token usando el servicio
        const payload = AuthService.verifyToken(token);

        // Adjuntar usuario al request
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({
                success: false,
                message: 'Token inválido o expirado',
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Error interno de autenticación',
        });
    }
};
