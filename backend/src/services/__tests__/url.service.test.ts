import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UrlService } from '../url.service';
import { prisma } from '@/config/database';
import { nanoid } from 'nanoid';
import { DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CacheService } from '@/services/cache.service';
import { ClickRepository } from '@/repositories/click.repository';
import { UrlRepository } from '@/repositories/url.repository';

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

// Mock CacheService
vi.mock('@/services/cache.service', () => {
    return {
        CacheService: class {
            get = vi.fn();
            set = vi.fn();
            delete = vi.fn();
        }
    };
});

// Mock repositories (if needed for typing, but we use them as args)
// We need to mock their instances effectively or construct the service with mocks

describe('UrlService', () => {
    let urlService: UrlService;
    let mockUrlRepository: any;
    let mockClickRepository: any;
    let mockCacheService: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Create fresh mocks for each test
        mockUrlRepository = {
            create: vi.fn(),
            findByAlias: vi.fn(),
            findById: vi.fn(),
            findByUser: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
        } as unknown as UrlRepository;

        mockClickRepository = {
            findManyRecent: vi.fn(),
        } as unknown as ClickRepository;

        mockCacheService = new CacheService({} as any); // Uses the mock implementation above

        urlService = new UrlService(
            mockUrlRepository,
            mockClickRepository,
            mockCacheService
        );
    });

    describe('shortenUrl', () => {
        it('should create a short URL with generated alias', async () => {
            // Arrange
            const longUrl = 'https://google.com';
            const generatedAlias = 'abc1234';
            (nanoid as any).mockReturnValue(generatedAlias);

            mockUrlRepository.create.mockResolvedValue({
                id: '1',
                alias: generatedAlias,
                longUrl,
                customAlias: false,
            } as any);

            // Act
            const result = await urlService.shortenUrl(longUrl);

            // Assert
            expect(nanoid).toHaveBeenCalledWith(7);
            expect(mockUrlRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                alias: generatedAlias,
                customAlias: false,
            }));
            expect(result.alias).toBe(generatedAlias);
        });

        it('should create a short URL with custom alias', async () => {
            // Arrange
            const longUrl = 'https://google.com';
            const customAlias = 'my-link';

            mockUrlRepository.findByAlias.mockResolvedValue(null); // Validar disponibilidad
            mockUrlRepository.create.mockResolvedValue({
                id: '1',
                alias: customAlias,
                longUrl,
                customAlias: true,
            } as any);

            // Act
            const result = await urlService.shortenUrl(longUrl, undefined, customAlias);

            // Assert
            expect(nanoid).not.toHaveBeenCalled();
            expect(mockUrlRepository.create).toHaveBeenCalled();
            expect(result.alias).toBe(customAlias);
        });

        it('should throw error if custom alias is taken', async () => {
            // Arrange
            const customAlias = 'taken';
            mockUrlRepository.findByAlias.mockResolvedValue({ id: 'existing' } as any);

            // Act & Assert
            await expect(urlService.shortenUrl('https://x.com', undefined, customAlias))
                .rejects.toThrow('El alias personalizado ya está en uso');
        });

        it('should handle P2002 collision error', async () => {
            // Arrange
            (nanoid as any).mockReturnValue('collision');

            const p2002Error = new Error('Unique constraint failed');
            (p2002Error as any).code = 'P2002';
            (p2002Error as any).meta = { target: ['alias'] };

            mockUrlRepository.create.mockRejectedValue(p2002Error);

            // Act & Assert
            await expect(urlService.shortenUrl('https://x.com'))
                .rejects.toThrow('El alias ya existe');
        });
    });

    describe('getUrlData', () => {
        it('should return data from Cache if cached', async () => {
            // Arrange
            const alias = 'cached';
            const cachedData = { id: '1', longUrl: 'https://cached.com', expiresAt: null };
            mockCacheService.get.mockResolvedValue(cachedData);

            // Act
            const result = await urlService.getUrlData(alias);

            // Assert
            expect(mockCacheService.get).toHaveBeenCalledWith(`url:${alias}`);
            expect(result).toEqual(cachedData);
            expect(mockUrlRepository.findByAlias).not.toHaveBeenCalled();
        });

        it('should fetch from DB and cache if not in Cache', async () => {
            // Arrange
            const alias = 'db-only';
            mockCacheService.get.mockResolvedValue(null);

            const dbData = { id: '1', longUrl: 'https://db.com', expiresAt: null };
            mockUrlRepository.findByAlias.mockResolvedValue(dbData as any);

            // Act
            const result = await urlService.getUrlData(alias);

            // Assert
            expect(mockUrlRepository.findByAlias).toHaveBeenCalledWith(alias);
            expect(mockCacheService.set).toHaveBeenCalledWith(
                `url:${alias}`,
                expect.objectContaining({ id: '1' }),
                86400
            );
            expect(result).toEqual(dbData);
        });
    });
});
