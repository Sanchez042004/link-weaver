import { prisma } from '@/config/database';
import { idGenerator } from '@/services/id-generator.service';
import { Url } from '@prisma/client';

export class UrlService {
    /**
     * Crear una URL acortada
     * 
     * @param longUrl - URL original a acortar
     * @param userId - ID del usuario (opcional)
     * @param customAlias - Alias personalizado (opcional)
     */
    public static async shortenUrl(
        longUrl: string,
        userId?: string,
        customAlias?: string
    ): Promise<Url> {

        let alias = customAlias;

        // 1. Si hay custom alias, verificar disponibilidad
        if (alias) {
            const existing = await prisma.url.findUnique({
                where: { alias },
            });
            if (existing) {
                throw new Error('El alias personalizado ya está en uso');
            }
        } else {
            // 2. Si no, generar uno único usando Snowflake + Base62
            // Garantizado libre de colisiones por diseño
            alias = idGenerator.generateShortCode();
        }

        // 3. Crear registro en DB
        const url = await prisma.url.create({
            data: {
                longUrl,
                alias,
                customAlias: !!customAlias,
                userId: userId || null, // null si es anónimo
            },
        });

        return url;
    }

    /**
   * Obtener URL por alias
   * (Usado para redirección y verificación)
   */
    public static async getUrlByAlias(alias: string): Promise<Url | null> {
        return prisma.url.findUnique({
            where: { alias },
        });
    }

    /**
     * Obtener URL original optimizado para redirección (Con Caché Redis)
     */
    public static async getLongUrl(alias: string): Promise<string | null> {
        const { redisClient } = await import('@/config/redis'); // Import dinámico para evitar ciclos si los hubiera, o directo arriba
        const client = redisClient.getClient();
        const cacheKey = `url:${alias}`;

        // 1. Intentar obtener de Redis
        try {
            if (redisClient.isReady()) {
                const cachedUrl = await client.get(cacheKey);
                if (cachedUrl) {
                    return cachedUrl;
                }
            }
        } catch (error) {
            console.error('⚠️ Error leyendo de Redis:', error);
            // Continuamos a DB
        }

        // 2. Buscar en DB
        const url = await prisma.url.findUnique({
            where: { alias },
            select: { longUrl: true },
        });

        if (!url) {
            return null;
        }

        // 3. Guardar en Redis (Fire and forget)
        try {
            if (redisClient.isReady()) {
                // Expiración: 24 horas (86400 segundos)
                await client.set(cacheKey, url.longUrl, { EX: 86400 });
            }
        } catch (error) {
            console.error('⚠️ Error escribiendo en Redis:', error);
        }

        return url.longUrl;
    }
}
