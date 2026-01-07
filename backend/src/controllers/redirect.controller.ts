import { Request, Response } from 'express';
import { UrlService } from '@/services/url.service';
import { AnalyticsService } from '@/services/analytics.service';
import { env } from '@/config/env';
import { Logger } from '@/config/logger';

export class RedirectController {
    constructor(
        private readonly urlService: UrlService,
        private readonly analyticsService: AnalyticsService
    ) { }

    /**
     * Redirect to original URL
     */
    public redirect = async (req: Request, res: Response): Promise<void> => {
        const { alias } = req.params;

        try {
            const urlData = await this.urlService.getUrlData(alias);

            if (urlData) {
                // Avoid browser cache to count clicks
                res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', '0');

                // Immediate redirect
                res.redirect(urlData.longUrl);

                // Tracking
                const forwarded = req.headers['x-forwarded-for'];
                const ip = typeof forwarded === 'string'
                    ? forwarded.split(',')[0]
                    : req.ip || req.socket.remoteAddress || '';
                const userAgent = (req.headers['user-agent'] as string) || '';
                const referer = (req.headers['referer'] as string) || '';

                // Extract UTM source for better attribution
                const utmSource = (req.query.utm_source as string) || '';

                // Fire and forget tracking
                this.analyticsService.trackClick(urlData.id, ip, userAgent, referer, utmSource)
                    .catch(err => Logger.error('Background tracking error:', err));

                return;
            }

            // Not found -> Frontend 404
            res.redirect(`${env.FRONTEND_URL}/404?alias=${alias}`);

        } catch (error) {
            Logger.error('Error in redirect:', error);
            // On error we might also want to redirect to frontend error page or just 500
            res.status(500).send('Internal Server Error');
        }
    }
}
