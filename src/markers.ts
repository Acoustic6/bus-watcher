import { createSelector } from 'reselect';
import COLORS from './common/constants/colors';
import { Cost, getColor } from './costs';
import { Site } from './sites';
import { sitesSelector } from './store/sites';

export type SiteMarker = Site & {
    color: string
    borderColor: string
    isSelected?: boolean
    cost?: Cost | null
    tooltip?: JSX.Element
}

export const DEFAULT_COLOR = COLORS.LIGHT_BLUE;
export const DEFAULT_BORDER_COLOR = COLORS.DARK_BLUE;

export const setMarkerColor = (marker: SiteMarker, color: string): void => {
    marker.color = color;
}

export const makeMarkersDefault = (markers: SiteMarker[]): void => {
    for (const marker of markers) {
        makeMarkerDefault(marker);
    }
}

export const makeMarkerDefault = (marker: SiteMarker): void => {
    marker.color = COLORS.LIGHT_BLUE;
    marker.borderColor = COLORS.DARK_BLUE;
    marker.isSelected = false;
    marker.cost = null;
}

export const makeMarkerSelected = (marker: SiteMarker): void => {
    marker.isSelected = true;
    marker.cost = null;
}

export const getDefaultSiteMarkers = createSelector(
    [sitesSelector],
    (sites: Site[]): SiteMarker[] => {
        console.time('getDefaultSiteMarkers');

        const siteMarkers = new Array<SiteMarker>();
        sites.forEach(site => {
            siteMarkers.push({
                siteId: site.siteId,
                siteName: site.siteName,
                latitude: site.latitude,
                longitude: site.longitude,
                color: DEFAULT_COLOR,
                borderColor: DEFAULT_BORDER_COLOR,
            })
        })
        console.timeEnd('getDefaultSiteMarkers');
        return siteMarkers;
    },
)

export const getSeparatedSiteMarkers = createSelector(
    [getDefaultSiteMarkers],
    (sites: SiteMarker[]): SiteMarker[] => {
        console.time('getSeparatedSiteMarkers');

        const separatedSites: Site[] = [];
        const diff = 0.0001;
        const dx = 0.0001;
        const dy = dx;

        sites.forEach((site: Site) => {
            const closerSite = separatedSites
                .find(ss =>
                    (Math.abs(ss.longitude - site.longitude) <= diff)
        && Math.abs(ss.latitude - site.latitude) <= diff);

            if (closerSite) {
                site.latitude = Number((site.latitude + dx).toFixed(4));
                site.longitude = Number((site.longitude + dy).toFixed(4));
            }
            separatedSites.push(site);
        });
        console.timeEnd('getSeparatedSiteMarkers');

        return separatedSites as SiteMarker[];
    })

export const getSiteMarkersById = createSelector(
    [getSeparatedSiteMarkers],
    (markers: SiteMarker[]): Map<number, SiteMarker> => {
        console.time('getSiteMarkersById');
        const result = markers.reduce((acc, prev) => acc.set(prev.siteId, prev), new Map<number, SiteMarker>());
        console.timeEnd('getSiteMarkersById');

        return result;
    })
