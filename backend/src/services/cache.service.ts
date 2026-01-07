import { LRUCache } from 'lru-cache';
import { Logger } from '@/config/logger';

export class CacheService {
    private memoryCache: LRUCache<string, any>;

    constructor() {
        // In-memory cache for ultra-fast access (Max 1000 items, 5 min TTL)
        this.memoryCache = new LRUCache({
            max: 1000,
            ttl: 1000 * 60 * 5, // 5 minutes
        });
        Logger.info('✅ CacheService: In-memory cache (LRU) inicializado.');
    }

    /**
     * Get value from cache (Memory Only)
     */
    public async get<T>(key: string): Promise<T | null> {
        try {
            const memoryValue = this.memoryCache.get(key);
            if (memoryValue) {
                return memoryValue as T;
            }
            return null;
        } catch (error) {
            Logger.warn(`⚠️ Cache GET error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set value in cache
     * @param ttl Time to live in seconds
     */
    public async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        try {
            this.memoryCache.set(key, value, { ttl: ttl * 1000 });
        } catch (error) {
            Logger.warn(`⚠️ Cache SET error for key ${key}:`, error);
        }
    }

    /**
     * Delete value from cache
     */
    public async delete(key: string): Promise<void> {
        try {
            this.memoryCache.delete(key);
        } catch (error) {
            Logger.warn(`⚠️ Cache DELETE error for key ${key}:`, error);
        }
    }
}
