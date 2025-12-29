import { Request, Response, NextFunction } from 'express';
import { Logger } from '@/config/logger';
import { env } from '@/config/env';

/**
 * 404 - Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: `La ruta ${req.method} ${req.path} no existe`,
        timestamp: new Date().toISOString(),
    });
};

/**
 * Error Handler Global
 */
export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    // Log del error centralizado
    Logger.error('Unhandled Error:', err);

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
};
