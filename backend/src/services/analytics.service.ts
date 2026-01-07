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
    public async getUrlStats(urlId: string, days: number = 7) {
        // Calculate start date based on filter
        let startDate: Date;
        let previousStartDate: Date;

        if (days === 0) {
            // All time: use a very old date
            startDate = new Date(0);
            previousStartDate = new Date(0);
        } else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - days);
        }
        // Parallel execution for performance
        const [
            totalClicks,
            countries,
            browsers,
            os,
            devices,
            recentClicks,
            lastClick,
            referrersCurrent,
            referrersPrevious
        ] = await Promise.all([
            this.clickRepository.countByUrlInRange(urlId, startDate),
            this.clickRepository.groupByCountry(urlId, startDate),
            this.clickRepository.groupByBrowser(urlId, startDate),
            this.clickRepository.groupByOS(urlId, startDate),
            this.clickRepository.groupByDevice(urlId, startDate),
            this.clickRepository.findDailyClicksBatch([urlId], startDate),
            this.clickRepository.findLastByUrl(urlId),
            this.clickRepository.groupByReferer(urlId, startDate),
            this.clickRepository.groupByReferer(urlId, previousStartDate, startDate)
        ]);

        return {
            totalClicks,
            lastAccessed: lastClick?.timestamp || null,
            blocks: {
                countries: countries.map((c: any) => ({ name: c.country || 'Unknown', value: c._count.country })),
                browsers: browsers.map((b: any) => ({ name: b.browser || 'Other', value: b._count.browser })),
                os: os.map((o: any) => ({ name: o.os || 'Other', value: o._count.os })),
                devices: devices.map((d: any) => ({ name: d.device || 'Other', value: d._count.device })),
                referrers: this.processReferrerTrends(referrersCurrent, referrersPrevious),
                timeline: this.transformToTimeline(recentClicks),
            },
        };
    }

    /**
     * Get full stats for a user
     */
    public async getUserStats(userId: string, days: number = 7) {
        let startDate: Date;
        let previousStartDate: Date;

        if (days === 0) {
            startDate = new Date(0);
            previousStartDate = new Date(0);
        } else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            previousStartDate = new Date(startDate);
            previousStartDate.setDate(previousStartDate.getDate() - days);
        }

        const topLinksPromise = days === 0
            ? this.urlRepository.findTopByUser(userId, 100)
            : this.clickRepository.findTopLinksByUserInRange(userId, startDate, 5);

        const [
            totalClicks,
            countries,
            browsers,
            os,
            devices,
            recentClicks,
            topLinksRaw,
            clicksToday,
            clicksYesterday,
            linksToday,
            linksYesterday,
            referrersCurrent,
            referrersPrevious
        ] = await Promise.all([
            this.clickRepository.countByUserInRange(userId, startDate, new Date()),
            this.clickRepository.groupByUserCountry(userId, startDate),
            this.clickRepository.groupByUserBrowser(userId, startDate),
            this.clickRepository.groupByUserOS(userId, startDate),
            this.clickRepository.groupByUserDevice(userId, startDate),
            this.clickRepository.findUserDailyClicks(userId, startDate),
            topLinksPromise,
            this.clickRepository.countByUserInRange(userId, this.getTodayStart(), new Date()),
            this.clickRepository.countByUserInRange(userId, this.getYesterdayStart(), this.getYesterdayEnd()),
            this.urlRepository.countByUserInRange(userId, this.getTodayStart(), new Date()),
            this.urlRepository.countByUserInRange(userId, this.getYesterdayStart(), this.getYesterdayEnd()),
            this.clickRepository.groupByUserReferer(userId, startDate),
            this.clickRepository.groupByUserReferer(userId, previousStartDate, startDate)
        ]);

        // Process Top Links
        let topLinks;
        if (days === 0) {
            topLinks = (topLinksRaw as any[])
                .sort((a, b) => b._count.clicks - a._count.clicks)
                .slice(0, 5)
                .map(link => ({
                    alias: link.alias,
                    longUrl: link.longUrl,
                    clicks: link._count.clicks
                }));
        } else {
            const raw = topLinksRaw as any[];
            // Fetch URL details
            const ids = raw.map(r => r.urlId);
            const urls = await this.urlRepository.findByIds(ids);
            const urlMap = new Map(urls.map(u => [u.id, u]));

            topLinks = raw.map(r => {
                const u = urlMap.get(r.urlId);
                return {
                    alias: u?.alias || 'Unknown',
                    longUrl: u?.longUrl || '',
                    clicks: r._count.id
                };
            });
        }

        return {
            totalClicks,
            comparison: {
                clicksToday,
                clicksYesterday,
                linksToday,
                linksYesterday
            },
            blocks: {
                countries: countries.map((c: any) => ({ name: c.country || 'Unknown', value: c._count.country })),
                browsers: browsers.map((b: any) => ({ name: b.browser || 'Other', value: b._count.browser })),
                os: os.map((o: any) => ({ name: o.os || 'Other', value: o._count.os })),
                devices: devices.map((d: any) => ({ name: d.device || 'Other', value: d._count.device })),
                referrers: this.processReferrerTrends(referrersCurrent, referrersPrevious),
                timeline: this.transformToTimeline(recentClicks),
                topLinks
            },
        };
    }



    private getTodayStart(): Date {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }

    private getYesterdayStart(): Date {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    private getYesterdayEnd(): Date {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(23, 59, 59, 999);
        return d;
    }

    private transformToTimeline(dbResult: any[]) {
        const timeline: Record<string, number> = {};
        // Handle both batch result (with urlId) and simple user result
        dbResult.forEach((item: any) => {
            timeline[item.date] = item.count;
        });
        return timeline;
    }

    private processReferrerTrends(current: any[], previous: any[]) {
        const prevMap = new Map(previous.map(p => [p.referer || 'Direct', p._count.referer]));

        return current.map(curr => {
            const name = curr.referer || 'Direct';
            const currVal = curr._count.referer;
            const prevVal = prevMap.get(name) || 0;

            let trend = 0;
            if (prevVal === 0) {
                trend = currVal > 0 ? 100 : 0;
            } else {
                trend = Math.round(((currVal - prevVal) / prevVal) * 100);
            }

            return {
                name,
                value: currVal,
                trend
            };
        });
    }
}
