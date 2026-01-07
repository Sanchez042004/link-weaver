import { nanoid } from 'nanoid';
import { Url } from '@prisma/client';
import { UrlRepository } from '@/repositories/url.repository';
import { CacheService } from '@/services/cache.service';
import { ConflictError, NotFoundError, ForbiddenError, BadRequestError } from '@/errors';
import { RESERVED_ALIASES } from '@/utils/constants';

import { ClickRepository } from '@/repositories/click.repository';

interface CachedUrlData {
    id: string;
    longUrl: string;
    expiresAt: Date | null;
}

export class UrlService {
    constructor(
        private readonly urlRepository: UrlRepository,
        private readonly clickRepository: ClickRepository,
        private readonly cacheService: CacheService
    ) { }

    /**
     * Create a short URL
     */
    public async shortenUrl(
        longUrl: string,
        userId?: string,
        customAlias?: string
    ): Promise<Url> {
        let alias = customAlias?.toLowerCase();

        // 1. Verify custom alias availability and reserved words
        if (alias) {
            // Check for reserved keywords
            if (RESERVED_ALIASES.includes(alias.toLowerCase())) {
                throw new BadRequestError('Este alias está reservado para el sistema');
            }

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
                ...(userId ? { user: { connect: { id: userId } } } : {}),
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
        const cacheKey = `url:${alias}`;

        // 1. Try to get from Cache
        const cached = await this.cacheService.get<CachedUrlData>(cacheKey);

        if (cached) {
            // Hydrate dates (JSON serialization turns dates to strings)
            if (cached.expiresAt) {
                cached.expiresAt = new Date(cached.expiresAt);
            }

            // VALIDATE EXPIRATION (Cache)
            if (cached.expiresAt && new Date() > cached.expiresAt) {
                return null;
            }
            return cached;
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

        // 3. Save to Cache
        const cacheData: CachedUrlData = {
            id: url.id,
            longUrl: url.longUrl,
            expiresAt: url.expiresAt
        };
        await this.cacheService.set(cacheKey, cacheData, 86400);

        return url;
    }

    /**
     * Get user URLs with pagination
     */
    public async getUserUrls(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [urls, total] = await this.urlRepository.findByUser(userId, skip, limit);

        // Fetch recent clicks for these URLs to build individual sparklines
        const urlIds = urls.map(u => u.id);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Optimized aggregation using DB GroupBy
        const dailyClicks = await this.clickRepository.findDailyClicksBatch(urlIds, sevenDaysAgo);

        // Process clicks into timelines per URL
        const timelines: Record<string, Record<string, number>> = {};

        // Initialize timeline structure
        urlIds.forEach(id => timelines[id] = {});

        // Fill with aggregated data from DB
        dailyClicks.forEach(item => {
            timelines[item.urlId][item.date] = item.count;
        });

        return {
            data: urls.map((url: any) => ({
                ...url,
                clicks: url._count.clicks,
                timeline: timelines[url.id] || {}
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

        // 3. Invalidate Cache
        await this.cacheService.delete(`url:${url.alias}`);
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

        // 2. If alias changes, verify availability and reserved words
        if (newCustomAlias && newCustomAlias.toLowerCase() !== url.alias.toLowerCase()) {
            const normalizedAlias = newCustomAlias.toLowerCase();

            // Check for reserved keywords
            if (RESERVED_ALIASES.includes(normalizedAlias)) {
                throw new BadRequestError('Este alias está reservado para el sistema');
            }

            const existing = await this.urlRepository.findByAlias(normalizedAlias);
            if (existing) {
                throw new ConflictError('El alias personalizado ya está en uso');
            }
            alias = normalizedAlias;
        }

        // 3. Update
        const updatedUrl = await this.urlRepository.update(urlId, {
            longUrl: newLongUrl || url.longUrl,
            alias,
            customAlias: !!newCustomAlias || url.customAlias,
        });

        // 4. Invalidate Cache
        await this.cacheService.delete(`url:${url.alias}`);
        if (alias !== url.alias) {
            await this.cacheService.delete(`url:${alias}`);
        }

        return updatedUrl;
    }
}
