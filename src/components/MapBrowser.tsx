import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer } from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import createMarker, { setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostMapBySiteFrom from '../services/costService';
import sites, { Site } from '../data/sites';
import { LIGHT_BLUE, PURPLE } from './../constants/colors';

interface MapBrowserProps {
  data: any;
}

type SiteWithStatus = Site & {
  isSelected: boolean;
  isHoveredOver: boolean
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  map: any;
  selectedSite: null | Site = null;
  markersBySiteId: Map<number,Marker> = new Map<number, Marker>(); // need it?
  hoveredOverMarkerColor = PURPLE;
  initialMarkerColor = LIGHT_BLUE;
  sites: SiteWithStatus[] = [];

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

    const costMap = getCostMapBySiteFrom(); //need it?

    sites.map(site => site as SiteWithStatus).forEach(site => {
      site.isSelected = false;
      site.isHoveredOver = false;
      this.sites.push(site);
    });

    // extract
    this.sites.forEach((site: SiteWithStatus) => {
      const marker = createMarker(site);
      marker.addTo(layer);
      this.markersBySiteId.set(site.siteId, marker);

      let onMouseOverFunc = this.getOnMouseOverFunc(site, layer);
      onMouseOverFunc = onMouseOverFunc.bind(this);
      marker.on('mouseover', e => onMouseOverFunc(e));
      
      let onMouseOutFunc = this.getOnMouseOutFunc(site, layer);
      onMouseOutFunc = onMouseOutFunc.bind(this);
      marker.on('mouseout', e => onMouseOutFunc(e));

      marker.on('click', (e, site) => {
        this.selectedSite = site;


      });
      
    });
  }

  isSiteSelected(site: Site): boolean {
    return site === this.selectedSite;
  }

  getOnMouseOverFunc(site: SiteWithStatus, layer: VectorLayer) {
    return (e: any) => {
      
      // fix multiple raise onmouseover event with maptalks markers
      if (site.isHoveredOver) {
        return;
      }
      site.isHoveredOver = true;

      const marker = e.target as Marker;
      if (!this.isSiteSelected(site)) {
        //extract?
        setMarkerColor(marker, this.hoveredOverMarkerColor);
        updateMarkerInfo(marker, [site.siteId, site.siteName].join('\n'), layer);
      }
    };
  }

  getOnMouseOutFunc(site: SiteWithStatus, layer: VectorLayer) {
    return (e: any) => {
      const marker = e.target as Marker;
      
      // fix multiple raise onmouseover event with maptalks markers
      site.isHoveredOver = false;
      
      if (!this.isSiteSelected(site)) {
        // extract?
        setMarkerColor(marker, this.initialMarkerColor);
        updateMarkerInfo(marker, '', layer);
      }
    };
  }
}

export default MapBrowser;
