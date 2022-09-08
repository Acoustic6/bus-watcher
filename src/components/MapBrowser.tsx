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

    // extract to service
    this.map = new maptalks.Map(document.getElementById('map') as HTMLElement, {
      center: [37.6219422357168, 55.75267445772434],
      zoom: 13.3,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
      }),
    });

    this.map.on('zooming', function (e: any) {
      console.log(e);
    });
  }

  render() {
    return <div id="map"></div>;
  }
}

export default MapBrowser;
