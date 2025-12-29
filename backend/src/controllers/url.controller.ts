import { Request, Response } from 'express';
import { z } from 'zod';
import { UrlService } from '@/services/url.service';
import { env } from '@/config/env';
import { Logger } from '@/config/logger';

// Schema para acortar URL
const shortenUrlSchema = z.object({
    longUrl: z.string().url('La URL proporcionada no es válida').max(2048, 'La URL es demasiado larga').regex(/^https?:\/\//, 'La URL debe comenzar con http:// o https://'),
    customAlias: z
        .string()
        .min(3, 'El alias debe tener al menos 3 caracteres')
        .max(20, 'El alias no puede tener más de 20 caracteres')
        .regex(/^[a-zA-Z0-9-_]+$/, 'El alias solo puede contener letras, números, guiones y guiones bajos')
        .optional(),
});

export class UrlController {
    /**
     * Crear URL Corta
     */
    public static async createShortUrl(req: Request, res: Response): Promise<void> {
        try {
            // 1. Validar input
            const data = shortenUrlSchema.parse(req.body);

            // 2. Obtener usuario (si existe)
            const userId = req.user?.userId;

            // 3. Llamar al servicio
            const urlRecord = await UrlService.shortenUrl(
                data.longUrl,
                userId,
                data.customAlias
            );

            // 4. Construir respuesta
            // La URL corta completa depende del dominio del backend
            const baseUrl = env.BASE_URL || `http://localhost:${env.PORT}`;
            const shortUrl = `${baseUrl}/${urlRecord.alias}`;

            res.status(201).json({
                success: true,
                message: 'URL acortada exitosamente',
                data: {
                    ...urlRecord,
                    shortUrl,
                },
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: error.issues,
                });
                return;
            }

            if (error instanceof Error) {
                if (error.message === 'El alias personalizado ya está en uso') {
                    res.status(409).json({
                        success: false,
                        message: error.message,
                    });
                    return;
                }
            }

            Logger.error('Error al acortar URL:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
    /**
     * Obtener URLs del usuario autenticado
     */
    public static async getMyUrls(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId; // Seguro por auth middleware
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await UrlService.getUserUrls(userId, page, limit);

            // Añadir shortUrl a cada item
            const baseUrl = env.BASE_URL || `http://localhost:${env.PORT}`;
            const enrichedData = result.data.map((u) => ({
                ...u,
                shortUrl: `${baseUrl}/${u.alias}`,
            }));

            res.status(200).json({
                success: true,
                data: enrichedData,
                meta: result.meta,
            });
        } catch (error) {
            Logger.error('Error obteniendo URLs:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }

    /**
     * Eliminar URL
     */
    public static async deleteUrl(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            await UrlService.deleteUrl(id, userId);

            res.status(200).json({
                success: true,
                message: 'URL eliminada correctamente',
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'URL no encontrada') {
                    res.status(404).json({ success: false, message: 'URL no encontrada' });
                    return;
                }
                if (error.message === 'No autorizado para eliminar esta URL') {
                    res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta URL' });
                    return;
                }
            }

            Logger.error('Error eliminando URL:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
}
