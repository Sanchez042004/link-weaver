import { prisma } from '@/config/database';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

export class AnalyticsService {
    /**
     * Registrar un nuevo click
     * 
     * Se ejecuta de forma asíncrona ("fire and forget") desde el controlador.
     * Analiza el User Agent y la IP para extraer metadatos sin guardar la IP real.
     */
    public static async trackClick(
        urlId: string,
        ip: string,
        userAgentString: string = '',
        referer: string = ''
    ): Promise<void> {
        try {
            // 1. Parsear User Agent
            const parser = new UAParser(userAgentString);
            const result = parser.getResult();
            const browser = result.browser.name || 'Other';
            const os = result.os.name || 'Other';
            const device = result.device.type || 'desktop';

            // 2. GeoIP Lookup
            const geo = geoip.lookup(ip);
            const country = geo ? geo.country : 'Unknown';

            // 3. Guardar en DB
            await prisma.click.create({
                data: {
                    urlId,
                    timestamp: new Date(),
                    ipAddress: null, // Privacidad
                    userAgent: userAgentString,
                    country,
                    referer: referer || 'Direct',
                    browser,
                    os,
                    device,
                },
            });
        } catch (error) {
            console.error('⚠️ Error tracking click:', error);
        }
    }

    /**
     * Obtener estadísticas completas de una URL
     */
    public static async getUrlStats(urlId: string) {
        // 1. Total Clicks
        const totalClicks = await prisma.click.count({
            where: { urlId },
        });

        // 2. Top Países
        const countries = await prisma.click.groupBy({
            by: ['country'],
            where: { urlId },
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 10,
        });

        // 3. Top Browsers
        const browsers = await prisma.click.groupBy({
            by: ['browser'],
            where: { urlId },
            _count: { browser: true },
            orderBy: { _count: { browser: 'desc' } },
            take: 5,
        });

        // 4. Top OS
        const os = await prisma.click.groupBy({
            by: ['os'],
            where: { urlId },
            _count: { os: true },
            orderBy: { _count: { os: 'desc' } },
            take: 5,
        });

        // 5. Devices
        const devices = await prisma.click.groupBy({
            by: ['device'],
            where: { urlId },
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } },
        });

        // 6. Clicks últimos 7 días
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentClicks = await prisma.click.findMany({
            where: {
                urlId,
                timestamp: { gte: sevenDaysAgo },
            },
            select: { timestamp: true },
        });

        const clicksByDate = recentClicks.reduce((acc, click) => {
            const date = click.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalClicks,
            blocks: {
                countries: countries.map((c) => ({ name: c.country || 'Unknown', value: c._count.country })),
                browsers: browsers.map((b) => ({ name: b.browser || 'Other', value: b._count.browser })),
                os: os.map((o) => ({ name: o.os || 'Other', value: o._count.os })),
                devices: devices.map((d) => ({ name: d.device || 'Other', value: d._count.device })),
                timeline: clicksByDate,
            },
        };
    }
}
