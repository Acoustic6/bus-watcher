import { Cost, costs } from '../data/costs';

const _costBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();

export function getCostsBySiteFromIdMap(): Map<number, Cost[]> {
  debugger;



  if (_costBySiteFromIdMap.size === 0) {
    costs.forEach(cost => {
      const key = cost.siteIdFrom;
      if (!_costBySiteFromIdMap.has(key)) {
        _costBySiteFromIdMap.set(key, [cost]);
      } else {
        const currentValue = _costBySiteFromIdMap.get(key) as Cost[];
        _costBySiteFromIdMap.set(key, [cost, ...currentValue]);
      }
    });
  }
  
  return _costBySiteFromIdMap;
}

export default (getCostsBySiteFromIdMap);