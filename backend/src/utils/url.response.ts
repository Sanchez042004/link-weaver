import { Url } from '@prisma/client';
import { env } from '@/config/env';

export interface UrlResponse {
    id: string;
    alias: string;
    shortUrl: string;
    longUrl: string;
    customAlias: boolean;
    clicks?: number;
    timeline?: Record<string, number>;
    createdAt: Date;
    expiresAt: Date | null;
}

const getBaseUrl = (): string => {
    return env.BASE_URL ? env.BASE_URL.replace(/\/$/, '') : `http://localhost:${env.PORT}`;
};

export const toUrlResponse = (url: Url & { _count?: { clicks: number }, timeline?: Record<string, number> }): UrlResponse => {
    const baseUrl = getBaseUrl();

    return {
        id: url.id,
        alias: url.alias,
        shortUrl: `${baseUrl}/${url.alias}`,
        longUrl: url.longUrl,
        customAlias: url.customAlias,
        clicks: url._count?.clicks ?? (url as any).clicks, // Handle both Prisma result and pre-processed
        timeline: (url as any).timeline,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt
    };
};
