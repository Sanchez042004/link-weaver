import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { UrlService } from '@/services/url.service';
import { env } from '@/config/env';
import { BadRequestError } from '@/errors';

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
    constructor(private readonly urlService: UrlService) { }

    /**
     * Crear URL Corta
     */
    public createShortUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // 1. Validar input
            const validation = shortenUrlSchema.safeParse(req.body);

            if (!validation.success) {
                // Formatting Zod errors
                const errorMessage = validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
                throw new BadRequestError(errorMessage);
            }

            const data = validation.data;

            // 2. Obtener usuario (si existe)
            const userId = req.user?.userId;

            // 3. Llamar al servicio
            const urlRecord = await this.urlService.shortenUrl(
                data.longUrl,
                userId,
                data.customAlias
            );

            // 4. Construir respuesta
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
            next(error);
        }
    }

    /**
     * Obtener URLs del usuario autenticado
     */
    public getMyUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId; // Seguro por auth middleware
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this.urlService.getUserUrls(userId, page, limit);

            // Añadir shortUrl a cada item
            const baseUrl = env.BASE_URL || `http://localhost:${env.PORT}`;
            const enrichedData = result.data.map((u: any) => ({
                ...u,
                shortUrl: `${baseUrl}/${u.alias}`,
            }));

            res.status(200).json({
                success: true,
                data: enrichedData,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Eliminar URL
     */
    public deleteUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            await this.urlService.deleteUrl(id, userId);

            res.status(200).json({
                success: true,
                message: 'URL eliminada correctamente',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualizar URL
     */
    public updateUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;
            const { longUrl, customAlias } = req.body;

            // Validaciones básicas 
            if (longUrl && !longUrl.startsWith('http')) {
                throw new BadRequestError('La URL debe ser válida (http/https)');
            }

            const updatedUrl = await this.urlService.updateUrl(id, userId, longUrl, customAlias);

            res.status(200).json({
                success: true,
                message: 'URL actualizada correctamente',
                data: updatedUrl,
            });
        } catch (error) {
            next(error);
        }
    }
}
