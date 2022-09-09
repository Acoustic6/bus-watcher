import {Map, Coordinate, TileLayer} from 'maptalks';

function initMap(): Map {
  const centerX = 37.61890;
  const centerY = 55.73865;
  const initialZoom = 12.577;
  const actualZoom = 13.3;
  const urlTemplate = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
  const attribution = '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>';
  const subdomains = ['a','b','c','d'];
  const centerCoordinate = new Coordinate(centerX, centerY);
  const center = [centerCoordinate.x, centerCoordinate.y];

  const map = new Map(document.getElementById('map') as HTMLElement, {
    center,
    doubleClickZoom : false,
    zoom: initialZoom,
    minZoom: actualZoom,
    baseLayer: new TileLayer('base', {
      urlTemplate,
      subdomains,
      attribution,
    }),
  });

  const extent = map.getExtent();

  // set map's max extent to map's extent at initialZoom
  map.setMaxExtent(extent);
  map.setZoom(actualZoom, { animation : false }); // рассказать про zoom и extent

  return map;
}

export default(initMap);