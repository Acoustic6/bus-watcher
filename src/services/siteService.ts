import getCostsBySiteFromIdMap, { Cost } from './costService';

export interface Site {
    siteId: number
    siteName: string
    longitude: number
    latitude: number
}

const _unreachableSitesBySiteFromId: Map<number, Site[]> = new Map<number, Site[]>();

export function getUnreachableSiteToIdsBySiteFromIdMap(costs: Cost[], sites: Site[]): Map<number, Site[]> {
    if (_unreachableSitesBySiteFromId.size === 0) {

        const separatedSites = getSites(sites);
        separatedSites.forEach(site => {
            if (!Array.from(getCostsBySiteFromIdMap(costs).keys()).find(key => key === site.siteId)) {
                _unreachableSitesBySiteFromId.set(site.siteId, separatedSites.filter(s => s.siteId !== site.siteId));
            }
        });

        Array.from(getCostsBySiteFromIdMap(costs).entries()).forEach(entry => {
            const [key, costs] = entry;

            if (costs.length < separatedSites.length) {
                const unreachableSites = separatedSites.filter(site => !costs.map(cost => cost.siteIdTo).includes(site.siteId));
                _unreachableSitesBySiteFromId.set(key, unreachableSites.filter(site => site.siteId !== key));
            }
        });
    }

    return _unreachableSitesBySiteFromId;
}

const _separatedSites: Site[] = [];

export function getSites(sites: Site[]): Site[] {
    if (_separatedSites.length === 0) {
        const diff = 0.0001;
        const dx = 0.0001;
        const dy = dx;

        sites.forEach((site: Site) => {
            const closerSite = _separatedSites
                .find(ss =>
                    (Math.abs(ss.longitude - site.longitude) <= diff)
        && Math.abs(ss.latitude - site.latitude) <= diff);

            if (closerSite) {
                site.latitude = Number((site.latitude + dx).toFixed(4));
                site.longitude = Number((site.longitude + dy).toFixed(4));
            }
            _separatedSites.push(site);
        });
    }

    return _separatedSites;
}

export default (getSites);
