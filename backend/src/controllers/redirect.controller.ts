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
            const longUrl = await UrlService.getLongUrl(alias);

            if (longUrl) {
                // Redirección 302 (Found/Temporary)
                // Usamos 302 para permitir tracking. Si usamos 301 (Permanent),
                // el navegador cacheará la redirección y no golpeará nuestro backend,
                // perdiendo datos de analytics.
                res.redirect(longUrl);
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
