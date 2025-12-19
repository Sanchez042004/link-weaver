import { Request, Response } from 'express';
import { UrlService } from '@/services/url.service';
import { env } from '@/config/env';

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
                // No esperamos a que termine (sin await) para no retrasar la respuesta,
                // aunque res.redirect ya envió headers.
                // Node.js manejará esto en background.
                const ip = req.ip || req.socket.remoteAddress || '';
                const userAgent = req.headers['user-agent'] || '';
                const referer = req.headers['referer'] || '';

                // Import dinámico para evitar posibles ciclos circulares iniciales
                // (aunque no debería haber aquí)
                import('@/services/analytics.service').then(({ AnalyticsService }) => {
                    AnalyticsService.trackClick(urlData.id, ip, userAgent, referer);
                });

                return;
            }

            // Si no encuentra la URL
            // Opción A: JSON 404 (para API pura)
            // res.status(404).json({ success: false, message: 'URL no encontrada' });

            // Opción B: Redirigir a página 404 del frontend (Mejor para usuarios)
            res.redirect(`${env.FRONTEND_URL}/404?alias=${alias}`);

        } catch (error) {
            console.error('Error en redirección:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}
