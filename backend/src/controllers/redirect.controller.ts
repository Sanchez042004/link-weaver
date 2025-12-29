import { Request, Response } from 'express';
import { UrlService } from '@/services/url.service';
import { AnalyticsService } from '@/services/analytics.service';
import { env } from '@/config/env';
import { Logger } from '@/config/logger';

export class RedirectController {
    /**
     * Redireccionar a la URL original
     */
    public static async redirect(req: Request, res: Response): Promise<void> {
        const { alias } = req.params;

        try {
            const urlData = await UrlService.getUrlData(alias); // Cambiado de getLongUrl a getUrlData

            if (urlData) {
                // Redirección inmediata (prioridad latencia)
                res.redirect(urlData.longUrl);

                // Tracking asíncrono (Fire and forget)
                // Usamos .catch() para manejar errores en la promesa flotante
                const ip = req.ip || req.socket.remoteAddress || '';
                const userAgent = req.headers['user-agent'] || '';
                const referer = req.headers['referer'] || '';

                AnalyticsService.trackClick(urlData.id, ip, userAgent, referer)
                    .catch(err => Logger.error('Background tracking error:', err));

                return;
            }

            // Si no encuentra la URL
            // Redirigir a página 404 del frontend (Mejor para usuarios)
            res.redirect(`${env.FRONTEND_URL}/404?alias=${alias}`);

        } catch (error) {
            Logger.error('Error en redirección:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}
