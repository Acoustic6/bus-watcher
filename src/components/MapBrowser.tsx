import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer } from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import createMarker, { setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostMapBySiteFrom from '../services/costService';
import sites, { Site } from '../data/sites';
import { PURPLE } from './../constants/colors';

interface MapBrowserProps {
  data: any;
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  map: any;
  selectedSite: null | Site = null;
  markersBySiteId: Map<number,Marker> = new Map<number, Marker>(); // need it?
  hoveredOverMarkerColor = PURPLE;
  initialMarkerColor = PURPLE;

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

    const costMap = getCostMapBySiteFrom();

    // extract
    sites.forEach((site: Site) => {
      const marker = createMarker(site);
      marker.addTo(layer);
      this.markersBySiteId.set(site.siteId, marker);

      // extract?
      let onMouseOverFunc = (e: any) => {
        const marker = e.target as Marker;
        setMarkerColor(marker, this.hoveredOverMarkerColor);
        if (!this.isSiteSelected(site)) {
          updateMarkerInfo(marker, site.siteId + '\n' + site.siteName, layer);
        }
      };
      onMouseOverFunc = onMouseOverFunc.bind(this);
      marker.on('mouseover', e => onMouseOverFunc(e));
      
      let onMouseOutFunc = (e: any) => {
        const marker = e.target as Marker;
        setMarkerColor(marker, this.hoveredOverMarkerColor);
        if (!this.isSiteSelected(site)) {
          updateMarkerInfo(marker, site.siteId + '\n' + site.siteName, layer);
        }
      };
      onMouseOutFunc = onMouseOverFunc.bind(this);
      marker.on('mouseout', onMouseOutFunc);

      marker.on('click', (e, site) => {
        this.selectedSite = site;


      });
      
    });
  }

  isSiteSelected(site: Site): boolean {
    return site === this.selectedSite;
  }
}

export default MapBrowser;
