import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer } from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import createMarker, { setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostMapBySiteFrom from '../services/costService';
import sites, { Site } from '../data/sites';
import { DARK_BLUE, LIGHT_BLUE, PURPLE } from './../constants/colors';

interface MapBrowserProps {
  data: any;
}

type SiteWithStatus = Site & {
  isSelected: boolean; // TODO: keep only selected site?
  isHoveredOver: boolean
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  map: any;
  markersBySiteId: Map<number,Marker> = new Map<number, Marker>(); // need it?
  hoveredOverMarkerColor = PURPLE;
  initialMarkerColor = LIGHT_BLUE;
  selectedMarkerColor = DARK_BLUE;
  sites: SiteWithStatus[] = [];
  selectedSite: null | SiteWithStatus = null;
  hoveredOverSite: null | SiteWithStatus = null;

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

    this.map.on('click', () => {
      if (this.hoveredOverSite) {
        // fix problem: click on marker === click on map
        return;
      }

      if (this.selectedSite) {
        // extract?
        this.selectedSite.isSelected = false;
        const marker = this.getMarkerBySite(this.selectedSite);
        setMarkerColor(marker, this.initialMarkerColor);
        updateMarkerInfo(marker, '', layer);

        this.selectedSite = null;
      }
    });

    // extract
    this.sites.forEach((site: SiteWithStatus) => {
      const marker = createMarker(site);
      marker.addTo(layer);
      this.markersBySiteId.set(site.siteId, marker);

      // extract?
      let onMouseOverFunc = this.getOnMouseOverFunc(site, layer);
      onMouseOverFunc = onMouseOverFunc.bind(this);
      marker.on('mouseover', e => onMouseOverFunc(e));
      
      // extract?
      let onMouseOutFunc = this.getOnMouseOutFunc(site, layer);
      onMouseOutFunc = onMouseOutFunc.bind(this);
      marker.on('mouseout', e => onMouseOutFunc(e));
      
      // extract?
      let onClickFunc = this.getOnClickFunc(site);
      onClickFunc = onClickFunc.bind(this);
      marker.on('click', e => onClickFunc(e));
    });
  }

  getOnMouseOverFunc(site: SiteWithStatus, layer: VectorLayer) {
    return (e: any) => {
      
      // fix multiple raise onmouseover event with maptalks markers
      if (site.isHoveredOver) {
        return;
      }
      site.isHoveredOver = true;

      // fix problem: click on marker === click on map
      this.hoveredOverSite = site;

      const marker = e.target as Marker;
      if (!site.isSelected) {
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

      // fix problem: click on marker === click on map
      this.hoveredOverSite = null;
      
      if (!site.isSelected) {
        // extract?
        setMarkerColor(marker, this.initialMarkerColor);
        updateMarkerInfo(marker, '', layer);
      }
    };
  }

  getOnClickFunc(site: SiteWithStatus) {
    return (e: any) => {
      const marker = e.target as Marker;
      
      site.isSelected = true;
      this.selectedSite = site;
      setMarkerColor(marker, this.selectedMarkerColor);
    };
  }

  getMarkerBySite(site: SiteWithStatus): Marker {
    return this.markersBySiteId.get(site.siteId) as Marker;
  }
}

export default MapBrowser;
