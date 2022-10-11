export interface Cost {
    siteIdFrom: number
    siteIdTo: number
    iwait: number
    inveht: number
    xwait: number
    xpen: number
    xnum: number
    cost: number
}

const _costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();

export function getCostsBySiteFromIdMap(costs: Cost[]): Map<number, Cost[]> {
    if (_costsBySiteFromIdMap.size === 0) {
        costs.forEach(cost => {
            const key = cost.siteIdFrom;
            if (!_costsBySiteFromIdMap.has(key)) {
                _costsBySiteFromIdMap.set(key, [cost]);
            } else {
                const currentValue = _costsBySiteFromIdMap.get(key) as Cost[];
                _costsBySiteFromIdMap.set(key, [cost, ...currentValue]);
            }
        });
    }

    return _costsBySiteFromIdMap;
}

export function getCostBetweenSites(siteFromId: number, siteToId: number): Cost | null {
    if (!_costsBySiteFromIdMap.has(siteFromId)) {
        return null;
    }

    const costs = _costsBySiteFromIdMap.get(siteFromId) as Cost[];
    return costs.find(cost => cost.siteIdTo === siteToId) ?? null;
}

export default (getCostsBySiteFromIdMap);
