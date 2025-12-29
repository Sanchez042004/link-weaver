import { prisma } from '@/config/database';
import { nanoid } from 'nanoid';
import { Url } from '@prisma/client';
import { redisClient } from '@/config/redis';
import { Logger } from '@/config/logger';

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
            // 2. Si no, generar uno aleatorio usando Nanoid
            alias = nanoid(7);
        }

        try {
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
        } catch (error: any) {
            // Manejar colisión de alias (Race Condition)
            if (error.code === 'P2002' && error.meta?.target?.includes('alias')) {
                throw new Error('El alias ya existe (intenta nuevamente)');
            }
            throw error;
        }
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
   * Obtener datos de URL por alias (Optimizado)
   * Retorna { id, longUrl } para redirección y analytics
   */
    public static async getUrlData(alias: string): Promise<{ id: string; longUrl: string; expiresAt: Date | null } | null> {
        const client = redisClient.getClient();
        const cacheKey = `url:${alias}`;

        // 1. Intentar obtener de Redis
        try {
            if (redisClient.isReady()) {
                const cached = await client.get(cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    // Hidratar fechas (JSON.parse devuelve strings)
                    if (parsed.expiresAt) {
                        parsed.expiresAt = new Date(parsed.expiresAt);
                    }

                    // VALIDAR EXPIRACIÓN (Redis Cache)
                    if (parsed.expiresAt && new Date() > parsed.expiresAt) {
                        // Si expiró, retornamos null (y idealmente invalidamos cache, pero el TTL se encargará)
                        return null;
                    }
                    return parsed;
                }
            }
        } catch (error) {
            Logger.warn('⚠️ Error leyendo de Redis:', error);
        }

        // 2. Buscar en DB
        const url = await prisma.url.findUnique({
            where: { alias },
            select: { id: true, longUrl: true, expiresAt: true },
        });

        if (!url) {
            return null;
        }

        // VALIDAR EXPIRACIÓN (DB)
        if (url.expiresAt && new Date() > url.expiresAt) {
            return null;
        }

        // 3. Guardar en Redis
        try {
            if (redisClient.isReady()) {
                await client.set(cacheKey, JSON.stringify(url), { EX: 86400 });
            }
        } catch (error) {
            Logger.warn('⚠️ Error escribiendo en Redis:', error);
        }

        return url;
    }
    /**
     * Obtener URLs de un usuario con paginación
     */
    public static async getUserUrls(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [urls, total] = await Promise.all([
            prisma.url.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
                include: {
                    _count: {
                        select: { clicks: true },
                    },
                },
            }),
            prisma.url.count({ where: { userId } }),
        ]);

        return {
            data: urls.map((url) => ({
                ...url,
                clickCount: url._count.clicks,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Eliminar una URL
     * Verifica que pertenezca al usuario
     */
    public static async deleteUrl(urlId: string, userId: string): Promise<void> {
        // 1. Verificar propiedad
        const url = await prisma.url.findUnique({
            where: { id: urlId },
        });

        if (!url) {
            throw new Error('URL no encontrada');
        }

        if (url.userId !== userId) {
            throw new Error('No autorizado para eliminar esta URL');
        }

        // 2. Eliminar (Cascade borrará clicks)
        await prisma.url.delete({
            where: { id: urlId },
        });

        // 3. Invalidar Cache de Redis
        if (redisClient.isReady()) {
            await redisClient.getClient().del(`url:${url.alias}`);
        }
    }
}
