import { PrismaClient, Prisma, Click } from '@prisma/client';

export class ClickRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: Prisma.ClickCreateInput): Promise<Click> {
        return this.prisma.click.create({ data });
    }

    async countByUrl(urlId: string): Promise<number> {
        return this.prisma.click.count({ where: { urlId } });
    }

    async countByUrlInRange(urlId: string, since: Date): Promise<number> {
        return this.prisma.click.count({
            where: {
                urlId,
                timestamp: { gte: since }
            }
        });
    }

    async findLastByUrl(urlId: string): Promise<Click | null> {
        return this.prisma.click.findFirst({
            where: { urlId },
            orderBy: { timestamp: 'desc' },
        });
    }

    // ... Implement other aggregations if needed, but for now Prisma's groupBy is complex to wrap generically.
    // I will expose a way to get the prisma delegate or just implement specific methods method by method.
    // For "Senior" quality, specific methods are better than exposing Prisma.

    async groupByCountry(urlId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { urlId };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['country'],
            where,
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 10,
        });
    }

    async groupByBrowser(urlId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { urlId };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['browser'],
            where,
            _count: { browser: true },
            orderBy: { _count: { browser: 'desc' } },
            take: 5,
        });
    }

    async groupByOS(urlId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { urlId };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['os'],
            where,
            _count: { os: true },
            orderBy: { _count: { os: 'desc' } },
            take: 5,
        });
    }

    async groupByDevice(urlId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { urlId };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['device'],
            where,
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } },
        });
    }

    async groupByReferer(urlId: string, since?: Date, until?: Date) {
        const where: Prisma.ClickWhereInput = { urlId };

        if (since || until) {
            where.timestamp = {};
            if (since) where.timestamp.gte = since;
            if (until) where.timestamp.lte = until;
        }

        return this.prisma.click.groupBy({
            by: ['referer'],
            where,
            _count: { referer: true },
            orderBy: { _count: { referer: 'desc' } },
            take: 10,
        });
    }

    async findRecent(urlId: string, since: Date) {
        return this.prisma.click.findMany({
            where: {
                urlId,
                timestamp: { gte: since },
            },
            select: { timestamp: true },
        });
    }

    // User aggregation methods
    async countByUser(userId: string): Promise<number> {
        return this.prisma.click.count({ where: { url: { userId } } });
    }

    async groupByUserCountry(userId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { url: { userId } };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['country'],
            where,
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 10,
        });
    }

    async groupByUserBrowser(userId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { url: { userId } };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['browser'],
            where,
            _count: { browser: true },
            orderBy: { _count: { browser: 'desc' } },
            take: 5,
        });
    }

    async groupByUserOS(userId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { url: { userId } };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['os'],
            where,
            _count: { os: true },
            orderBy: { _count: { os: 'desc' } },
            take: 5,
        });
    }

    async groupByUserDevice(userId: string, since?: Date) {
        const where: Prisma.ClickWhereInput = { url: { userId } };
        if (since) where.timestamp = { gte: since };

        return this.prisma.click.groupBy({
            by: ['device'],
            where,
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } },
        });
    }

    async findTopLinksByUserInRange(userId: string, since: Date, limit: number = 5) {
        return this.prisma.click.groupBy({
            by: ['urlId'],
            where: {
                url: { userId },
                timestamp: { gte: since }
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: limit
        });
    }

    async groupByUserReferer(userId: string, since?: Date, until?: Date) {
        const where: Prisma.ClickWhereInput = { url: { userId } };

        if (since || until) {
            where.timestamp = {};
            if (since) where.timestamp.gte = since;
            if (until) where.timestamp.lte = until;
        }

        return this.prisma.click.groupBy({
            by: ['referer'],
            where,
            _count: { referer: true },
            orderBy: { _count: { referer: 'desc' } },
            take: 10,
        });
    }

    async findManyRecent(urlIds: string[], since: Date) {
        return this.prisma.click.findMany({
            where: {
                urlId: { in: urlIds },
                timestamp: { gte: since },
            },
            select: {
                urlId: true,
                timestamp: true
            },
        });
    }

    async findUserRecent(userId: string, since: Date) {
        return this.prisma.click.findMany({
            where: {
                url: { userId },
                timestamp: { gte: since },
            },
            select: { timestamp: true },
        });
    }

    async countByUserInRange(userId: string, start: Date, end: Date): Promise<number> {
        return this.prisma.click.count({
            where: {
                url: { userId },
                timestamp: {
                    gte: start,
                    lte: end
                }
            }
        });
    }

    async findUserDailyClicks(userId: string, since: Date) {
        const result = await this.prisma.$queryRaw<Array<{ date: string; count: number }>>`
            SELECT TO_CHAR(c."timestamp", 'YYYY-MM-DD') as date, COUNT(*)::int as count
            FROM "clicks" c
            JOIN "urls" u ON c."urlId" = u."id"
            WHERE u."userId" = ${userId}
            AND c."timestamp" >= ${since}
            GROUP BY TO_CHAR(c."timestamp", 'YYYY-MM-DD')
            ORDER BY date ASC
        `;
        return result;
    }

    async findDailyClicksBatch(urlIds: string[], since: Date) {
        if (urlIds.length === 0) return [];

        // Casting result for type safety
        const result = await this.prisma.$queryRaw<Array<{ urlId: string; date: string; count: number }>>`
            SELECT "urlId", TO_CHAR("timestamp", 'YYYY-MM-DD') as date, COUNT(*)::int as count
            FROM "clicks"
            WHERE "urlId" IN (${Prisma.join(urlIds)})
            AND "timestamp" >= ${since}
            GROUP BY "urlId", TO_CHAR("timestamp", 'YYYY-MM-DD')
            ORDER BY date ASC
        `;
        return result;
    }
}
