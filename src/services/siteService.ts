import sites, { Site } from '../data/sites';
import getCostsBySiteFromIdMap from './costService';

const _unreachableSitesBySiteFromId: Map<number, Site[]> = new Map<number, Site[]>();

export function getUnreachableSiteToIdsBySiteFromIdMap(): Map<number, Site[]> {
  sites.forEach(site => {
    if (!Array.from(getCostsBySiteFromIdMap().keys()).find(key => key === site.siteId)) {
      _unreachableSitesBySiteFromId.set(site.siteId, sites);
    }
  });

  Array.from(getCostsBySiteFromIdMap().entries()).forEach(entry => {
    const key = entry[0];
    const costs = entry[1];

    if (costs.length < sites.length) {
      const unreachableSites = sites.filter(site => !costs.map(cost => cost.siteIdTo).includes(site.siteId));
      _unreachableSitesBySiteFromId.set(key, unreachableSites.filter(site => site.siteId !== key));
    }
  });

  return _unreachableSitesBySiteFromId;
}

export default (getUnreachableSiteToIdsBySiteFromIdMap);