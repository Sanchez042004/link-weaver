import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UrlService } from '../url.service';
import { prisma } from '@/config/database';
import { nanoid } from 'nanoid';
import { DeepMockProxy } from 'vitest-mock-extended';
import { redisClient } from '@/config/redis'; // Import needed to access mock
import { PrismaClient } from '@prisma/client';

// Mock DB
vi.mock('@/config/database', async () => {
    const { mockDeep } = await import('vitest-mock-extended');
    return {
        prisma: mockDeep<PrismaClient>(),
    };
});

// Mock Nanoid
vi.mock('nanoid', () => ({
    nanoid: vi.fn(),
}));

// Mock Redis
vi.mock('@/config/redis', () => {
    const mockRedisClient = {
        get: vi.fn(),
        set: vi.fn(),
    };
    return {
        redisClient: {
            getClient: () => mockRedisClient,
            isReady: () => true,
        },
    };
});

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
// Helper to access the redis mock
const getMockRedis = () => redisClient.getClient() as unknown as { get: any; set: any };

describe('UrlService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('shortenUrl', () => {
        it('should create a short URL with generated alias', async () => {
            // Arrange
            const longUrl = 'https://google.com';
            const generatedAlias = 'abc1234';
            (nanoid as any).mockReturnValue(generatedAlias);

            prismaMock.url.create.mockResolvedValue({
                id: '1',
                alias: generatedAlias,
                longUrl,
                customAlias: false,
            } as any);

            // Act
            const result = await UrlService.shortenUrl(longUrl);

            // Assert
            expect(nanoid).toHaveBeenCalledWith(7);
            expect(prismaMock.url.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    alias: generatedAlias,
                    customAlias: false,
                }),
            }));
            expect(result.alias).toBe(generatedAlias);
        });

        it('should create a short URL with custom alias', async () => {
            // Arrange
            const longUrl = 'https://google.com';
            const customAlias = 'my-link';

            prismaMock.url.findUnique.mockResolvedValue(null); // Validar disponibilidad
            prismaMock.url.create.mockResolvedValue({
                id: '1',
                alias: customAlias,
                longUrl,
                customAlias: true,
            } as any);

            // Act
            const result = await UrlService.shortenUrl(longUrl, undefined, customAlias);

            // Assert
            expect(nanoid).not.toHaveBeenCalled();
            expect(prismaMock.url.create).toHaveBeenCalled();
            expect(result.alias).toBe(customAlias);
        });

        it('should throw error if custom alias is taken', async () => {
            // Arrange
            const customAlias = 'taken';
            prismaMock.url.findUnique.mockResolvedValue({ id: 'existing' } as any);

            // Act & Assert
            await expect(UrlService.shortenUrl('https://x.com', undefined, customAlias))
                .rejects.toThrow('El alias personalizado ya está en uso');
        });

        it('should handle P2002 collision error', async () => {
            // Arrange
            (nanoid as any).mockReturnValue('collision');

            const p2002Error = new Error('Unique constraint failed');
            (p2002Error as any).code = 'P2002';
            (p2002Error as any).meta = { target: ['alias'] };

            prismaMock.url.create.mockRejectedValue(p2002Error);

            // Act & Assert
            await expect(UrlService.shortenUrl('https://x.com'))
                .rejects.toThrow('El alias ya existe');
        });
    });

    describe('getUrlData', () => {
        it('should return data from Redis if cached', async () => {
            // Arrange
            const alias = 'cached';
            const cachedData = { id: '1', longUrl: 'https://cached.com' };
            const mockRedisClient = getMockRedis();
            mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedData));

            // Act
            const result = await UrlService.getUrlData(alias);

            // Assert
            expect(mockRedisClient.get).toHaveBeenCalledWith(`url:${alias}`);
            expect(result).toEqual(cachedData);
            expect(prismaMock.url.findUnique).not.toHaveBeenCalled();
        });

        it('should fetch from DB and cache if not in Redis', async () => {
            // Arrange
            const alias = 'db-only';
            const mockRedisClient = getMockRedis();
            mockRedisClient.get.mockResolvedValue(null);

            const dbData = { id: '1', longUrl: 'https://db.com' };
            prismaMock.url.findUnique.mockResolvedValue(dbData as any);

            // Act
            const result = await UrlService.getUrlData(alias);

            // Assert
            expect(prismaMock.url.findUnique).toHaveBeenCalledWith({
                where: { alias },
                select: { id: true, longUrl: true, expiresAt: true },
            });
            expect(mockRedisClient.set).toHaveBeenCalledWith(
                `url:${alias}`,
                JSON.stringify(dbData),
                expect.any(Object) // options
            );
            expect(result).toEqual(dbData);
        });
    });
});
