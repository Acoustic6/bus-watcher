import * as React from 'react';
import { Component } from 'react';
import * as maptalks from 'maptalks';
import './MapBrowser.scss';
import 'maptalks/dist/maptalks.css'; // temp

interface MapBrowserProps {
  data: any;
}

class MapBrowser extends Component<MapBrowserProps> {
  map: any;

  componentDidMount() {
    if (this.map) return;

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
    return null;
  }
}

export default MapBrowser;
