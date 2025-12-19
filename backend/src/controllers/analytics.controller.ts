import { Request, Response } from 'express';
import { AnalyticsService } from '@/services/analytics.service';
import { prisma } from '@/config/database';

export class AnalyticsController {

    /**
     * Obtener estadísticas de una URL
     * GET /api/analytics/:alias
     */
    public static async getStats(req: Request, res: Response): Promise<void> {
        const { alias } = req.params;
        const userId = req.user?.userId;

        try {
            // 1. Buscar URL y verificar propiedad
            const url = await prisma.url.findUnique({
                where: { alias },
                select: { id: true, userId: true, longUrl: true }
            });

            if (!url) {
                res.status(404).json({ success: false, message: 'URL no encontrada' });
                return;
            }

            // Verificación de seguridad:
            // - Si la URL pertenece a un usuario, solo ese usuario puede ver las stats.
            // - Si la URL es anónima, cualquiera podría verlas (o podríamos bloquearlo).
            //   Por ahora, permitimos ver stats de URLs anónimas si se conoce el alias (seguridad por oscuridad simple),
            //   pero protegemos estrictamente las de usuarios registrados.
            if (url.userId && url.userId !== userId) {
                res.status(403).json({ success: false, message: 'No tienes permiso para ver estas estadísticas' });
                return;
            }

            // 2. Obtener stats
            const stats = await AnalyticsService.getUrlStats(url.id);

            res.json({
                success: true,
                data: {
                    alias,
                    longUrl: url.longUrl,
                    ...stats
                }
            });

        } catch (error) {
            console.error('Error analytics:', error);
            res.status(500).json({ success: false, message: 'Error obteniendo estadísticas' });
        }
    }
}
