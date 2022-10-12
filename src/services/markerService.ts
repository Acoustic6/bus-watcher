// import { SiteMarker } from '../components/MapBrowser';
// import { DARK_BLUE, LIGHT_BLUE } from '../common/constants/colors';
// import { Site } from './siteService';

// function createMarker(site: Site): Marker {
//     return new Marker(
//         [site.longitude, site.latitude],
//         {
//             'symbol': {
//                 'markerType': 'pin',
//                 'markerFill': LIGHT_BLUE,
//                 'markerFillOpacity': 1,
//                 'markerLineColor': DARK_BLUE,
//                 'markerLineWidth': 1,
//                 'markerLineOpacity': 1,
//                 'markerLineDasharray': [],
//                 'markerWidth': 40,
//                 'markerHeight': 40,
//                 'markerDx': 0,
//                 'markerDy': 0,
//                 'markerOpacity': 1,
//                 'textFaceName': 'sans-serif',
//                 'textName': '{name}',
//                 'textSize': 23,
//                 'textDy': -50,
//                 'textDx': 30,
//                 'textFill': '#333333',
//                 'textWrapWidth': 1000,
//                 'textLineSpacing': 4,
//                 'textWrapCharacter': '\n',
//                 'textHorizontalAlignment': 'right',
//                 'textHaloFill': 'white',
//                 'textHaloRadius': 7,
//             },
//         },
//     );
// }

// export function createMarkersBySites(sites: SiteMarker[]): void {
    // sites.forEach((site: SiteMarker) => {
    //     site.marker = createMarker(site);
    // });
// }

// export function updateMarkerInfo(marker: Marker, text: string, layer: VectorLayer): void {
//     marker.setProperties({ name: text });
//     // fix lib bug: text is not updated without recreation
//     marker.remove();
//     marker.addTo(layer);
// }

// export function setMarkerColor(marker: Marker, color: string) {
//     marker.updateSymbol({ markerFill: color });
// }

// export default (createMarkersBySites);

const a = 1;
export default a;
