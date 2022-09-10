import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer } from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import createMarker, { setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostsBySiteFromIdMap from '../services/costService';
import sites, { Site } from '../data/sites';
import { BLACK, DARK_BLUE, DARK_PURPLE, GREEN, LIGHT_BLUE, PURPLE, RED, YELLOW } from './../constants/colors';
import { Cost, costs } from '../data/costs';

interface MapBrowserProps {
  data: any;
}

type SiteWithStatus = Site & {
  isSelected: boolean;
  isHoveredOver: boolean
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  readonly markerInfoSeparator = '\n';
  map: any;
  markersBySiteId: Map<number,Marker> = new Map<number, Marker>(); // need it?
  hoveredOverMarkerColor = PURPLE;
  initialMarkerColor = LIGHT_BLUE;
  selectedMarkerColor = DARK_BLUE;
  sites: SiteWithStatus[] = [];
  selectedSite: null | SiteWithStatus = null;
  hoveredOverSite: null | SiteWithStatus = null;
  costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();

  componentDidMount() {
    // extract?
    this.costsBySiteFromIdMap = getCostsBySiteFromIdMap();

    this.initMap();
  }

  render() {
    return <div id="map"></div>;
  }

  initMap(): void {
    if (this.map) return;
    this.map = initMap();
    
    const layer = new VectorLayer('vector').addTo(this.map);

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

        this.sites.forEach(site => {
          const marker = this.getMarkerBySiteId(site.siteId);
          setMarkerColor(marker, this.initialMarkerColor);
          updateMarkerInfo(marker, '', layer);
        });
        // extract
        this.selectedSite.isSelected = false;
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
      let onClickFunc = this.getOnMarkerClickFunc(site);
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
      const basicInfo = [site.siteId, site.siteName].join(this.markerInfoSeparator);
      updateMarkerInfo(marker, basicInfo, layer);

      if (!site.isSelected && this.selectedSite && this.costsBySiteFromIdMap.has(this.selectedSite.siteId)) {
        const costs = this.costsBySiteFromIdMap.get(this.selectedSite.siteId) as Cost[];
        const cost = costs.find(cost => cost.siteIdTo === site.siteId);

        updateMarkerInfo(
          marker, 
          [
            basicInfo,
            `Агрегированные затраты: ${cost?.cost} мин.`,
            `Время ожидания: ${cost?.iwait} мин.`,
            `Время в салоне: ${cost?.inveht} мин.`,
            `Число пересадок: ${cost?.xnum}`,
            `Штраф за пересадки: ${cost?.xpen}`,
          ].join(this.markerInfoSeparator),
          layer);
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
        updateMarkerInfo(marker, '', layer);
        if (!this.selectedSite) {
          setMarkerColor(marker, this.initialMarkerColor);
        }
      }
    };
  }

  getOnMarkerClickFunc(site: SiteWithStatus) {
    return (e: any) => {
      const marker = e.target as Marker;
      
      site.isSelected = true;
      this.selectedSite = site;
      setMarkerColor(marker, this.selectedMarkerColor);

      // extract
      const costMap = getCostsBySiteFromIdMap(); //need it?
      const costs = costMap.get(site.siteId);
      costs?.forEach(cost => {
        // extract
        const marker = this.getMarkerBySiteId(cost.siteIdTo);
        setMarkerColor(marker, this.getColorByCost(cost.cost));
      });
    };
  }

  getMarkerBySiteId(siteId: number): Marker {
    return this.markersBySiteId.get(siteId) as Marker;
  }

  getColorByCost(cost: number) {
    if (cost < 5) {
      return GREEN;
    } else if (cost < 15) {
      return YELLOW;
    } else if (cost <= 30) {
      return RED;
    } else if (cost > 30) {
      return DARK_PURPLE;
    }

    return BLACK;
  }
}

export default MapBrowser;
