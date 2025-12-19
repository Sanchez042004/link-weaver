import { Request, Response } from 'express';
import { z } from 'zod';
import { UrlService } from '@/services/url.service';
import { env } from '@/config/env';

// Schema para acortar URL
const shortenUrlSchema = z.object({
    longUrl: z.string().url('La URL proporcionada no es válida'),
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
            // Usaremos env.PORT para desarrollo, idealmente debería haber una variable BASE_URL pública
            const baseUrl = process.env.BASE_URL || `http://localhost:${env.PORT}`;
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

            console.error('Error al acortar URL:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
}
