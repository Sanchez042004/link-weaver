import { PrismaClient, Url, Prisma } from '@prisma/client';

export class UrlRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: Prisma.UrlCreateInput): Promise<Url> {
        return this.prisma.url.create({ data });
    }

    async findByAlias(alias: string): Promise<Url | null> {
        return this.prisma.url.findFirst({
            where: {
                alias: {
                    equals: alias,
                    mode: 'insensitive'
                }
            }
        });
    }

    async findById(id: string): Promise<Url | null> {
        return this.prisma.url.findUnique({ where: { id } });
    }

    async findByIds(ids: string[]): Promise<Url[]> {
        return this.prisma.url.findMany({
            where: { id: { in: ids } }
        });
    }

    async findByUser(userId: string, skip: number, limit: number): Promise<[Url[], number]> {
        return Promise.all([
            this.prisma.url.findMany({
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
            this.prisma.url.count({ where: { userId } }),
        ]);
    }

    async delete(id: string): Promise<Url> {
        return this.prisma.url.delete({ where: { id } });
    }

    async update(id: string, data: Prisma.UrlUpdateInput): Promise<Url> {
        return this.prisma.url.update({
            where: { id },
            data,
        });
    }

    async findTopByUser(userId: string, limit: number): Promise<{ alias: string; longUrl: string; _count: { clicks: number } }[]> {
        return this.prisma.url.findMany({
            where: { userId },
            take: limit,
            select: {
                alias: true,
                longUrl: true,
                _count: {
                    select: { clicks: true }
                }
            }
        });
    }

    async countByUserInRange(userId: string, start: Date, end: Date): Promise<number> {
        return this.prisma.url.count({
            where: {
                userId,
                createdAt: {
                    gte: start,
                    lte: end
                }
            }
        });
    }
}
