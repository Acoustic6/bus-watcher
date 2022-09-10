import { Marker, VectorLayer } from 'maptalks';
import { Site } from '../data/sites';
import { DARK_BLUE, LIGHT_BLUE } from './../constants/colors';

function createMarker(site: Site): Marker {
  return new Marker(
    [site.longitude, site.latitude],
    {
      'symbol' : {
        'markerType': 'pin',
        'markerFill': LIGHT_BLUE,
        'markerFillOpacity': 1,
        'markerLineColor': DARK_BLUE,
        'markerLineWidth': 1,
        'markerLineOpacity': 1,
        'markerLineDasharray':[],
        'markerWidth': 40,
        'markerHeight': 40,
        'markerDx': 0,
        'markerDy': 0,
        'markerOpacity' : 1,
        'textFaceName' : 'sans-serif',
        'textName' : '{name}',
        'textSize' : 14,
        'textDy'   : 24,
        'textFill': '#333333',
        'textWrapWidth': 200,
        'textLineSpacing' : 4,
        'textWrapCharacter': '\n',
      },
    },
  );
}

export function updateMarkerInfo(marker: Marker, text: string, layer: VectorLayer): void {
  marker.setProperties({ name: text });
  marker.remove();
  marker.addTo(layer);
}

export function setMarkerColor(marker: Marker, color: string) {
  marker.updateSymbol({ markerFill: color });
}

export default(createMarker);