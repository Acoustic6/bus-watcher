import {Marker} from 'maptalks';
import sites from '../data/sites';

function getAllMarkers(): Marker[] {
  return sites.map(site => 
    new Marker(
      [site.longitude, site.latitude],
      {
        'symbol' : {
          'markerType': 'pin',
          'markerFill': 'rgb(135,196,240)',
          'markerFillOpacity': 1,
          'markerLineColor': '#34495e',
          'markerLineWidth': 3,
          'markerLineOpacity': 1,
          'markerLineDasharray':[],
          'markerWidth': 40,
          'markerHeight': 40,
          'markerDx': 0,
          'markerDy': 0,
          'markerOpacity' : 1,
        },
      },
    ));
}

export default(getAllMarkers);