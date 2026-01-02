import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import { Logger } from '@/config/logger';
import { ClickRepository } from '@/repositories/click.repository';
import { UrlRepository } from '@/repositories/url.repository';

export class AnalyticsService {
    constructor(
        private readonly clickRepository: ClickRepository,
        private readonly urlRepository: UrlRepository
    ) { }

    /**
     * Track a new click
     * "Fire and forget" async
     */
    public async trackClick(
        urlId: string,
        ip: string,
        userAgentString: string = '',
        referer: string = ''
    ): Promise<void> {
        try {
            // 1. User Agent Parser
            const parser = new UAParser(userAgentString);
            const result = parser.getResult();
            const browser = result.browser.name || 'Other';
            const os = result.os.name || 'Other';
            const device = result.device.type || 'desktop';

            // 2. GeoIP Lookup
            let lookupIp = ip;
            if (lookupIp === '::1' || lookupIp === '127.0.0.1') {
                lookupIp = '8.8.8.8'; // Simulate US IP for localhost dev testing
            }

            const geo = geoip.lookup(lookupIp);
            const country = geo ? geo.country : 'Unknown';

            Logger.info(`[Analytics] Click tracked: IP=${ip} (${lookupIp}), Country=${country}`);

            // 3. Save to DB via Repository
            await this.clickRepository.create({
                url: { connect: { id: urlId } },
                timestamp: new Date(),
                ipAddress: null, // Privacy
                userAgent: userAgentString,
                country,
                referer: referer || 'Direct',
                browser,
                os,
                device,
            });

        } catch (error) {
            Logger.error('⚠️ Error processing click:', error);
        }
    }

    /**
     * Get full stats for a URL
     */
    public async getUrlStats(urlId: string) {
        // Parallel execution for performance
        const [
            totalClicks,
            countries,
            browsers,
            os,
            devices,
            recentClicks,
            lastClick
        ] = await Promise.all([
            this.clickRepository.countByUrl(urlId),
            this.clickRepository.groupByCountry(urlId),
            this.clickRepository.groupByBrowser(urlId),
            this.clickRepository.groupByOS(urlId),
            this.clickRepository.groupByDevice(urlId),
            this.clickRepository.findRecent(urlId, this.getSevenDaysAgo()),
            this.clickRepository.findLastByUrl(urlId)
        ]);

        return {
            totalClicks,
            lastAccessed: lastClick?.timestamp || null,
            blocks: {
                countries: countries.map((c: any) => ({ name: c.country || 'Unknown', value: c._count.country })),
                browsers: browsers.map((b: any) => ({ name: b.browser || 'Other', value: b._count.browser })),
                os: os.map((o: any) => ({ name: o.os || 'Other', value: o._count.os })),
                devices: devices.map((d: any) => ({ name: d.device || 'Other', value: d._count.device })),
                timeline: this.processTimeline(recentClicks),
            },
        };
    }

    /**
     * Get full stats for a user
     */
    public async getUserStats(userId: string) {
        const [
            totalClicks,
            countries,
            browsers,
            os,
            devices,
            recentClicks,
            topLinksRaw
        ] = await Promise.all([
            this.clickRepository.countByUser(userId),
            this.clickRepository.groupByUserCountry(userId),
            this.clickRepository.groupByUserBrowser(userId),
            this.clickRepository.groupByUserOS(userId),
            this.clickRepository.groupByUserDevice(userId),
            this.clickRepository.findUserRecent(userId, this.getSevenDaysAgo()),
            this.urlRepository.findTopByUser(userId, 100)
        ]);

        // Sort by click count and take top 5
        const topLinks = topLinksRaw
            .sort((a, b) => b._count.clicks - a._count.clicks)
            .slice(0, 5)
            .map(link => ({
                alias: link.alias,
                longUrl: link.longUrl,
                clicks: link._count.clicks
            }));

        return {
            totalClicks,
            blocks: {
                countries: countries.map((c: any) => ({ name: c.country || 'Unknown', value: c._count.country })),
                browsers: browsers.map((b: any) => ({ name: b.browser || 'Other', value: b._count.browser })),
                os: os.map((o: any) => ({ name: o.os || 'Other', value: o._count.os })),
                devices: devices.map((d: any) => ({ name: d.device || 'Other', value: d._count.device })),
                timeline: this.processTimeline(recentClicks),
                topLinks
            },
        };
    }

    // Helpers
    private getSevenDaysAgo(): Date {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    }

    private processTimeline(clicks: { timestamp: Date }[]) {
        return clicks.reduce((acc, click) => {
            const date = click.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }
}
