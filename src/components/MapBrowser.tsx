import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer } from 'maptalks';
import './mapBrowser.scss';
import 'maptalks/dist/maptalks.css';
import initMap from '../services/mapService';
import { createMarkersBySites as addMarkersToSites, setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostsBySiteFromIdMap, { getCostBetweenSites } from '../services/costService';
import { Site } from '../data/sites';
import { BLACK, DARK_BLUE, DARK_PURPLE, GREEN, LIGHT_BLUE, PURPLE, RED, YELLOW } from '../constants/colors';
import { Cost } from '../data/costs';
import getSites, { getUnreachableSiteToIdsBySiteFromIdMap } from '../services/siteService';

export type SiteMarker = Site & {
  marker: Marker;
}

interface MapBrowserProps {
  data: any;
}

// TODO: may be keep only App component?
class MapBrowser extends Component<MapBrowserProps> {
  readonly markerInfoSeparator = '\n';
  map: any;
  layer: VectorLayer = new VectorLayer('vector');
  sites: SiteMarker[] = [];
  hoveredOverMarkerColor = PURPLE;
  initialMarkerColor = LIGHT_BLUE;
  selectedMarkerColor = DARK_BLUE;
  selectedSite: null | Site = null;
  hoveredOverSite: null | Site = null;
  costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();
  unreachableSiteToIdsBySiteFromIdMap: Map<number, Site[]> = new Map<number, Site[]>();
  siteMarkerBySiteId: Map<number, SiteMarker> = new Map<number, SiteMarker>();

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
    
    this.layer.addTo(this.map);

    this.sites = getSites() as SiteMarker[];

    // extract
    addMarkersToSites(this.sites);

    this.sites.forEach(site => {
      this.siteMarkerBySiteId.set(site.siteId, site);
    });

    this.sites.forEach((site: SiteMarker) => {
      site.marker.addTo(this.layer);

      // extract?
      let onMouseOverFunc = this.getOnMouseOverFunc(site);
      onMouseOverFunc = onMouseOverFunc.bind(this);
      site.marker.on('mouseover', e => onMouseOverFunc(e));
      
      // extract?
      let onMouseOutFunc = this.getOnMouseOutFunc(site);
      onMouseOutFunc = onMouseOutFunc.bind(this);
      site.marker.on('mouseout', e => onMouseOutFunc(e));
      
      // extract?
      let onClickFunc = this.getOnMarkerClickFunc(site);
      onClickFunc = onClickFunc.bind(this);
      site.marker.on('click', e => onClickFunc(e));
    });

    this.map.on('click', () => {
      if (this.hoveredOverSite) {
        // fix problem: click on marker === click on map
        return;
      }

      if (this.selectedSite) {
        // extract?

        this.sites.forEach(site => {
          setMarkerColor(site.marker, this.initialMarkerColor);
          updateMarkerInfo(site.marker, '', this.layer);
        });
        // extract
        this.selectedSite = null;
      }
    });
  }

  getOnMouseOverFunc(site: Site) {
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
        this.layer,
      );
    };
  }

  getOnMouseOutFunc(site: Site) {
    return (e: any) => {
      const marker = e.target as Marker;
      
      // fix problem: click on marker === click on map
      this.hoveredOverSite = null;
      
      if (!this.isSiteSelected(site)) {
        // extract?
        updateMarkerInfo(marker, '', this.layer);
        if (!this.selectedSite) {
          setMarkerColor(marker, this.initialMarkerColor);
        }
      }
    };
  }

  getOnMarkerClickFunc(site: SiteMarker) {
    return (e: any) => {
      const marker = e.target as Marker;

      this.selectedSite = site;
      setMarkerColor(marker, this.selectedMarkerColor);
      updateMarkerInfo(marker, this.getBasicSiteInfo(site), this.layer);

      // extract
      if (this.costsBySiteFromIdMap.has(site.siteId)) {
        const costs = this.costsBySiteFromIdMap.get(site.siteId) as Cost[];
        costs.forEach((cost: Cost) => {
          const marker = this.siteMarkerBySiteId.get(cost.siteIdTo)?.marker as Marker;
          updateMarkerInfo(marker, '', this.layer);
          setMarkerColor(marker, this.getColorByCost(cost.cost));
        });
      }

      if (this.unreachableSiteToIdsBySiteFromIdMap.has(site.siteId)) {
        const unreachableSites = this.unreachableSiteToIdsBySiteFromIdMap.get(site.siteId) as Site[];
        unreachableSites.forEach(site => {
          const marker = this.siteMarkerBySiteId.get(site.siteId)?.marker as Marker;
          updateMarkerInfo(marker, '', this.layer);
          setMarkerColor(marker, BLACK);
        });
      }
    };
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
