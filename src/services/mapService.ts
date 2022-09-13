import { Map, Coordinate, TileLayer } from 'maptalks';

function createMap(): Map {
  const centerX = 37.608;
  const centerY = 55.76765;
  const initialZoom = 12.577;
  const actualZoom = 12.9;
  const urlTemplate = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  const attribution = '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>';
  const subdomains = ['a','b','c','d'];
  const centerCoordinate = new Coordinate(centerX, centerY);
  const center = [centerCoordinate.x, centerCoordinate.y];

  const map = new Map(document.getElementById('map') as HTMLElement, {
    center,
    doubleClickZoom : false,
    zoom: initialZoom,
    baseLayer: new TileLayer('base', {
      urlTemplate,
      subdomains,
      attribution,
    }),
  });

  const extent = map.getExtent();

  // set map's max extent to map's extent at initialZoom
  map.setMaxExtent(extent);
  map.setZoom(actualZoom, { animation : false });
  map.setMinZoom(actualZoom);

  return map;
}

export default(createMap);