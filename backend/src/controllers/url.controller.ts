import { NextFunction, Request, Response } from 'express';
import { UrlService } from '@/services/url.service';

import { toUrlResponse } from '@/utils/url.response';

export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    /**
     * Crear URL Corta
     */
    public createShortUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Data validated by middleware
            const { longUrl, customAlias } = req.body;

            // 1. Obtener usuario (si existe)
            const userId = req.user?.userId;

            // 2. Llamar al servicio
            const urlRecord = await this.urlService.shortenUrl(
                longUrl,
                userId,
                customAlias
            );

            // 3. Construir respuesta
            const response = toUrlResponse(urlRecord);

            res.status(201).json({
                success: true,
                message: 'URL acortada exitosamente',
                data: response,
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

            // Añadir shortUrl a cada item usando DTO
            const enrichedData = result.data.map((u: any) => toUrlResponse(u));

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
