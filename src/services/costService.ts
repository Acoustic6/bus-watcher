import { Cost, costs } from '../data/costs';

export function getCostMapBySiteFrom(): Map<number, Cost[]>{
  const map = new Map<number, Cost[]>();

  costs.forEach(cost => {
    const key = cost.siteIdFrom;
    if (!map.has(key)) {
      map.set(key, [cost]);
    } else {
      const currentValue = map.get(key) as Cost[];
      map.set(key, [cost, ...currentValue]);
    }
  });
  
  return map;
}

export default (getCostMapBySiteFrom);