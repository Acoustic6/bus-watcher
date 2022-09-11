import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer } from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import createMarker, { setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostsBySiteFromIdMap, { getCostBetweenSites } from '../services/costService';
import { Site } from '../data/sites';
import { BLACK, DARK_BLUE, DARK_PURPLE, GREEN, LIGHT_BLUE, PURPLE, RED, YELLOW } from '../constants/colors';
import { Cost } from '../data/costs';
import getSites, { getUnreachableSiteToIdsBySiteFromIdMap } from '../services/siteService';

interface MapBrowserProps {
  data: any;
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  readonly markerInfoSeparator = '\n';
  map: any;
  markersBySiteId: Map<number,Marker> = new Map<number, Marker>(); // need it?
  hoveredOverMarkerColor = PURPLE;
  initialMarkerColor = LIGHT_BLUE;
  selectedMarkerColor = DARK_BLUE;
  sites: Site[] = [];
  selectedSite: null | Site = null;
  hoveredOverSite: null | Site = null;
  costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();
  unreachableSiteToIdsBySiteFromIdMap: Map<number, Site[]> = new Map<number, Site[]>();

  componentDidMount() {
    this.costsBySiteFromIdMap = getCostsBySiteFromIdMap();
    this.unreachableSiteToIdsBySiteFromIdMap = getUnreachableSiteToIdsBySiteFromIdMap();
    this.initMap();
  }

  render() {
    return <div id="map"></div>;
  }

  initMap(): void {
    if (this.map) return;
    this.map = initMap();
    
    const layer = new VectorLayer('vector').addTo(this.map);

    getSites().map(site => site as Site).forEach(site => {
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
        this.selectedSite = null;
      }
    });

    // extract
    this.sites.forEach((site: Site) => {
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
      let onClickFunc = this.getOnMarkerClickFunc(site, layer);
      onClickFunc = onClickFunc.bind(this);
      marker.on('click', e => onClickFunc(e));
    });
  }

  getOnMouseOverFunc(site: Site, layer: VectorLayer) {
    return (e: any) => {
      
      // fix multiple raise onmouseover event with maptalks markers
      if (this.isSiteHoveredOver(site) && site.siteId === this.hoveredOverSite?.siteId) {
        return;
      }

      // fix problem: click on marker === click on map
      this.hoveredOverSite = site;

      const marker = e.target as Marker;
      let markerInfo = this.getBasicSiteInfo(site);

      const cost = this.selectedSite ? getCostBetweenSites(this.selectedSite.siteId, site.siteId) : null;
      if (!this.isSiteSelected(site) && cost) {
        markerInfo = [markerInfo, this.getAdvancedSiteInfo(cost)].join(this.markerInfoSeparator);
      }

      updateMarkerInfo(
        marker, 
        markerInfo,
        layer,
      );
    };
  }

  getOnMouseOutFunc(site: Site, layer: VectorLayer) {
    return (e: any) => {
      const marker = e.target as Marker;
      
      // fix problem: click on marker === click on map
      this.hoveredOverSite = null;
      
      if (!this.isSiteSelected(site)) {
        // extract?
        updateMarkerInfo(marker, '', layer);
        if (!this.selectedSite) {
          setMarkerColor(marker, this.initialMarkerColor);
        }
      }
    };
  }

  getOnMarkerClickFunc(site: Site, layer: VectorLayer) {
    return (e: any) => {
      const marker = e.target as Marker;

      this.selectedSite = site;
      setMarkerColor(marker, this.selectedMarkerColor);
      updateMarkerInfo(marker, this.getBasicSiteInfo(site), layer);

      // extract
      if (this.costsBySiteFromIdMap.has(site.siteId)) {
        const costs = this.costsBySiteFromIdMap.get(site.siteId) as Cost[];
        costs.forEach(cost => {
        // extract
          const marker = this.getMarkerBySiteId(cost.siteIdTo);
          updateMarkerInfo(marker, '', layer);
          setMarkerColor(marker, this.getColorByCost(cost.cost));
        });
      }

      if (this.unreachableSiteToIdsBySiteFromIdMap.has(site.siteId)) {
        const unreachableSites = this.unreachableSiteToIdsBySiteFromIdMap.get(site.siteId) as Site[];
        unreachableSites.forEach(site => {
          const marker = this.getMarkerBySiteId(site.siteId);
          updateMarkerInfo(marker, '', layer);
          setMarkerColor(marker, BLACK);
        });
      }
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

  getBasicSiteInfo(site: Site) {
    return [site.siteId, site.siteName].join(this.markerInfoSeparator);
  }

  getAdvancedSiteInfo(cost: Cost | undefined) { // undef
    return [`Агрегированные затраты: ${cost?.cost} мин.`,
      `Время ожидания: ${cost?.iwait} мин.`,
      `Время в салоне: ${cost?.inveht} мин.`,
      `Число пересадок: ${cost?.xnum}`,
      `Штраф за пересадки: ${cost?.xpen}`].join(this.markerInfoSeparator);
  }

  isSiteSelected(site: Site) {
    return this.selectedSite && this.selectedSite.siteId === site.siteId;
  }

  isSiteHoveredOver(site: Site) {
    return this.hoveredOverSite && this.hoveredOverSite.siteId === site.siteId;
  }
}

export default MapBrowser;
