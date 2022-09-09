import * as React from 'react';
import { Component } from 'react';
import * as maptalks from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';

interface MapBrowserProps {
  data: any;
}

class MapBrowser extends Component<MapBrowserProps> {
  map: any;

  componentDidMount() {
    if (this.map) return;

    const centerX = 37.61890; // readonly
    const centerY = 55.73865;
    const initialZoom = 12.577;
    const actualZoom = 13.3;
    const centerCoordinate = new maptalks.Coordinate(centerX, centerY);
    const center = [centerCoordinate.x, centerCoordinate.y];

    // extract to service
    this.map = new maptalks.Map(document.getElementById('map') as HTMLElement, {
      center,
      doubleClickZoom : false,
      zoom: initialZoom,
      minZoom: actualZoom,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
      }),
    });

    const extent = this.map.getExtent(); //this.map => map

    // set map's max extent to map's extent at initialZoom
    this.map.setMaxExtent(extent);

    this.map.setZoom(actualZoom, { animation : false }); // рассказать про zoom и extent

    const {map} = this;



    const layer = new maptalks.VectorLayer('vector').addTo(map);

    const marker1 = new maptalks.Marker(
      centerCoordinate,
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
    ).addTo(layer);
    
    console.log(marker1.getSymbol());
    
    marker1.on('click', function(e) {
      const color =`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
      e.target.updateSymbol({markerFill: color});
    });
  }

  render() {
    return <div id="map"></div>;
  }
}

export default MapBrowser;
