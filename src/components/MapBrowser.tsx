import * as React from 'react';
import { Component } from 'react';
import {VectorLayer, Coordinate} from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import getAllMarkers from '../services/markerService';

interface MapBrowserProps {
  data: any;
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  map: any;

  componentDidMount() {
    this.initMap();
  }

  render() {
    return <div id="map"></div>;
  }

  initMap(): void {
    if (this.map) return;

    this.map = initMap();
    
    const layer = new VectorLayer('vector').addTo(this.map);




    getAllMarkers().forEach(marker => {
      marker.addTo(layer);

      // marker.on('click', function(e) {
      //   const color =`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
      //   e.target.updateSymbol({markerFill: color});
      // });
    });

    // const marker1 = new Marker(
    //   marker1Coords,
    //   {
    //     'symbol' : {
    //       'markerType': 'pin',
    //       'markerFill': 'rgb(135,196,240)',
    //       'markerFillOpacity': 1,
    //       'markerLineColor': '#34495e',
    //       'markerLineWidth': 3,
    //       'markerLineOpacity': 1,
    //       'markerLineDasharray':[],
    //       'markerWidth': 40,
    //       'markerHeight': 40,
    //       'markerDx': 0,
    //       'markerDy': 0,
    //       'markerOpacity' : 1,
    //     },
    //   },
    // ).addTo(layer);
    
    // marker1.on('click', function(e) {
    //   const color =`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
    //   e.target.updateSymbol({markerFill: color});
    // });
  }
}

export default MapBrowser;
