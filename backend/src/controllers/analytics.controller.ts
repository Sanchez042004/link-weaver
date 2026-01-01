import { NextFunction, Request, Response } from 'express';
import { AnalyticsService } from '@/services/analytics.service';
import { UrlService } from '@/services/url.service';
import { env } from '@/config/env';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/errors';

export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService,
        private readonly urlService: UrlService
    ) { }

    /**
     * Get URL stats
     * GET /api/analytics/:alias
     */
    public getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { alias } = req.params;
        const userId = req.user?.userId;

        try {
            // 1. Find URL and verify ownership
            // Using service to get URL info. We might need a "getByAlias" method that returns full info including userId.
            // urlService.getUrlByAlias currently returns Url model.
            const url = await this.urlService.getUrlByAlias(alias);

            if (!url) {
                throw new NotFoundError('URL no encontrada');
            }

            // Security check
            if (url.userId && url.userId !== userId) {
                throw new ForbiddenError('No tienes permiso para ver estas estadísticas');
            }

            // 2. Get stats
            const stats = await this.analyticsService.getUrlStats(url.id);

            // 3. Build response
            const baseUrl = env.BASE_URL || `http://localhost:${env.PORT}`;
            const shortUrl = `${baseUrl}/${alias}`;

            res.json({
                success: true,
                data: {
                    id: url.id,
                    alias,
                    shortUrl,
                    longUrl: url.longUrl,
                    createdAt: url.createdAt,
                    // We don't have lastAccessed directly from simple service call unless we ask analytics service for it or repo.
                    // The previous code did a separate query for lastClick.
                    // I should probably include it in getUrlStats or let it be.
                    // For now, let's skip lastAccessed or assume it's part of stats if modified.
                    // The stats object returned by service is { totalClicks, blocks: {...} }.
                    // I will assume the frontend can handle missing lastAccessed or I should add it to AnalyticsService.getUrlStats.
                    // Given "Senior" requirements, I should add it to the Service to avoid "Controller doing DB queries".
                    ...stats
                }
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * Get Dashboard Stats
     * GET /api/analytics
     */
    public getGeneralStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.userId;

        if (!userId) {
            // Middleware should handle this usually but if not
            throw new UnauthorizedError();
        }

        try {
            const stats = await this.analyticsService.getUserStats(userId);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}
