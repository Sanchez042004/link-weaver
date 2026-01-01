import { nanoid } from 'nanoid';
import { Url } from '@prisma/client';
import { UrlRepository } from '@/repositories/url.repository';
import { RedisClient } from '@/config/redis'; // Importing the class type
import { Logger } from '@/config/logger';
import { ConflictError, NotFoundError, ForbiddenError } from '@/errors';

export class UrlService {
    constructor(
        private readonly urlRepository: UrlRepository,
        private readonly redisClient: RedisClient
    ) { }

    /**
     * Create a short URL
     */
    public async shortenUrl(
        longUrl: string,
        userId?: string,
        customAlias?: string
    ): Promise<Url> {
        let alias = customAlias;

        // 1. Verify custom alias availability
        if (alias) {
            const existing = await this.urlRepository.findByAlias(alias);
            if (existing) {
                throw new ConflictError('El alias personalizado ya está en uso');
            }
        } else {
            // 2. Generate random alias using Nanoid
            alias = nanoid(7);
        }

        try {
            // 3. Create record in DB
            const url = await this.urlRepository.create({
                longUrl,
                alias,
                customAlias: !!customAlias,
                userId: userId || null,
            });
            return url;
        } catch (error: any) {
            // Handle alias collision (Race Condition)
            if (error.code === 'P2002' && error.meta?.target?.includes('alias')) {
                // If it was a custom alias, it's definitely a conflict
                if (customAlias) {
                    throw new ConflictError('El alias personalizado ya está en uso');
                }
                // If it was random, it's a collision on generated ID (rare but possible),
                // client should retry (or we could retry recursively here)
                throw new ConflictError('El alias ya existe (intenta nuevamente)');
            }
            throw error;
        }
    }

    /**
     * Get URL by alias (for redirection/verification)
     */
    public async getUrlByAlias(alias: string): Promise<Url | null> {
        return this.urlRepository.findByAlias(alias);
    }

    /**
     * Get URL data by alias (Optimized with Redis)
     * Returns { id, longUrl } for redirection and analytics
     */
    public async getUrlData(alias: string): Promise<{ id: string; longUrl: string; expiresAt: Date | null } | null> {
        const client = this.redisClient.getClient();
        const cacheKey = `url:${alias}`;

        // 1. Try to get from Redis
        try {
            if (this.redisClient.isReady()) {
                const cached = await client.get(cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    // Hydrate dates
                    if (parsed.expiresAt) {
                        parsed.expiresAt = new Date(parsed.expiresAt);
                    }

                    // VALIDATE EXPIRATION (Redis Cache)
                    if (parsed.expiresAt && new Date() > parsed.expiresAt) {
                        return null;
                    }
                    return parsed;
                }
            }
        } catch (error) {
            Logger.warn('⚠️ Error reading from Redis:', error);
        }

        // 2. Search in DB
        const url = await this.urlRepository.findByAlias(alias);

        if (!url) {
            return null;
        }

        // VALIDATE EXPIRATION (DB)
        if (url.expiresAt && new Date() > url.expiresAt) {
            return null;
        }

        // 3. Save to Redis
        try {
            if (this.redisClient.isReady()) {
                // Cache only necessary fields to save memory
                const cacheData = {
                    id: url.id,
                    longUrl: url.longUrl,
                    expiresAt: url.expiresAt
                };
                await client.set(cacheKey, JSON.stringify(cacheData), { EX: 86400 });
            }
        } catch (error) {
            Logger.warn('⚠️ Error writing to Redis:', error);
        }

        return url;
    }

    /**
     * Get user URLs with pagination
     */
    public async getUserUrls(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [urls, total] = await this.urlRepository.findByUser(userId, skip, limit);

        return {
            data: urls.map((url: any) => ({
                ...url,
                clicks: url._count.clicks,
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
     * Delete URL
     */
    public async deleteUrl(urlId: string, userId: string): Promise<void> {
        // 1. Verify ownership
        const url = await this.urlRepository.findById(urlId);

        if (!url) {
            throw new NotFoundError('URL no encontrada');
        }

        if (url.userId !== userId) {
            throw new ForbiddenError('No autorizado para eliminar esta URL');
        }

        // 2. Delete
        await this.urlRepository.delete(urlId);

        // 3. Invalidate Redis Cache
        if (this.redisClient.isReady()) {
            await this.redisClient.getClient().del(`url:${url.alias}`);
        }
    }

    /**
     * Update URL (longUrl or customAlias)
     */
    public async updateUrl(
        urlId: string,
        userId: string,
        newLongUrl?: string,
        newCustomAlias?: string
    ): Promise<Url> {
        // 1. Verify ownership
        const url = await this.urlRepository.findById(urlId);

        if (!url) {
            throw new NotFoundError('URL no encontrada');
        }

        if (url.userId !== userId) {
            throw new ForbiddenError('No autorizado para editar esta URL');
        }

        let alias = url.alias;

        // 2. If alias changes, verify availability
        if (newCustomAlias && newCustomAlias !== url.alias) {
            const existing = await this.urlRepository.findByAlias(newCustomAlias);
            if (existing) {
                throw new ConflictError('El alias personalizado ya está en uso');
            }
            alias = newCustomAlias;
        }

        // 3. Update
        const updatedUrl = await this.urlRepository.update(urlId, {
            longUrl: newLongUrl || url.longUrl,
            alias,
            customAlias: !!newCustomAlias || url.customAlias,
        });

        // 4. Invalidate Redis Cache
        if (this.redisClient.isReady()) {
            await this.redisClient.getClient().del(`url:${url.alias}`);
            if (alias !== url.alias) {
                await this.redisClient.getClient().del(`url:${alias}`);
            }
        }

        return updatedUrl;
    }
}
