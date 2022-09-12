import { Cost, costs } from '../data/costs';

const _costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();

export function getCostsBySiteFromIdMap(): Map<number, Cost[]> {
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

export default (getCostsBySiteFromIdMap);