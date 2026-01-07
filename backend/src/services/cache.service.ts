import { RedisClient } from '@/config/redis';
import { Logger } from '@/config/logger';

export class CacheService {
    constructor(private readonly redisClient: RedisClient) { }

    /**
     * Get value from cache
     */
    public async get<T>(key: string): Promise<T | null> {
        try {
            if (!this.redisClient.isReady()) return null;

            const value = await this.redisClient.getClient().get(key);
            if (!value) return null;

            return JSON.parse(value) as T;
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
            if (!this.redisClient.isReady()) return;

            const serialized = JSON.stringify(value);
            await this.redisClient.getClient().set(key, serialized, { EX: ttl });
        } catch (error) {
            Logger.warn(`⚠️ Cache SET error for key ${key}:`, error);
        }
    }

    /**
     * Delete value from cache
     */
    public async delete(key: string): Promise<void> {
        try {
            if (!this.redisClient.isReady()) return;

            await this.redisClient.getClient().del(key);
        } catch (error) {
            Logger.warn(`⚠️ Cache DELETE error for key ${key}:`, error);
        }
    }
}
