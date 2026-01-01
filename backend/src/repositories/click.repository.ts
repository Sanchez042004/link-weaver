import { PrismaClient, Prisma, Click } from '@prisma/client';

export class ClickRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: Prisma.ClickCreateInput): Promise<Click> {
        return this.prisma.click.create({ data });
    }

    async countByUrl(urlId: string): Promise<number> {
        return this.prisma.click.count({ where: { urlId } });
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

    async groupByCountry(urlId: string) {
        return this.prisma.click.groupBy({
            by: ['country'],
            where: { urlId },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 10,
        });
    }

    async groupByBrowser(urlId: string) {
        return this.prisma.click.groupBy({
            by: ['browser'],
            where: { urlId },
            _count: { browser: true },
            orderBy: { _count: { browser: 'desc' } },
            take: 5,
        });
    }

    async groupByOS(urlId: string) {
        return this.prisma.click.groupBy({
            by: ['os'],
            where: { urlId },
            _count: { os: true },
            orderBy: { _count: { os: 'desc' } },
            take: 5,
        });
    }

    async groupByDevice(urlId: string) {
        return this.prisma.click.groupBy({
            by: ['device'],
            where: { urlId },
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } },
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

    async groupByUserCountry(userId: string) {
        return this.prisma.click.groupBy({
            by: ['country'],
            where: { url: { userId } },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 10,
        });
    }

    async groupByUserBrowser(userId: string) {
        return this.prisma.click.groupBy({
            by: ['browser'],
            where: { url: { userId } },
            _count: { browser: true },
            orderBy: { _count: { browser: 'desc' } },
            take: 5,
        });
    }

    async groupByUserOS(userId: string) {
        return this.prisma.click.groupBy({
            by: ['os'],
            where: { url: { userId } },
            _count: { os: true },
            orderBy: { _count: { os: 'desc' } },
            take: 5,
        });
    }

    async groupByUserDevice(userId: string) {
        return this.prisma.click.groupBy({
            by: ['device'],
            where: { url: { userId } },
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } },
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
}
