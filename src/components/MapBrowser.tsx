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
      center: [-0.113049,51.498568],
      zoom: 14,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
      }),
    });
  }

  render() {
    return <div id="map"></div>;
  }
}

export default MapBrowser;
