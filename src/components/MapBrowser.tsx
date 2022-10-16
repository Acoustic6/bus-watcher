import * as React from 'react';
import { Component } from 'react';
import { Cost } from '../services/costService';
import { DARK_BLUE, LIGHT_BLUE } from '../common/constants/colors';
import { Site } from '../services/siteService';
import { connect } from 'react-redux';
import { BusWatcherState } from '..';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';


export type SiteMarker = Site & {
// marker: Marker
    marker: any
}

interface OwnProps {
    children?: React.ReactChild
}

export interface DispatchProps {
    actions: {
        handleFetchCosts: () => void
        handleFetchSites: () => void
    }
}

export interface StateProps {
    costs: Cost[]
    sites: Site[]
}

class MapBrowser extends Component<OwnProps & StateProps & DispatchProps> {
    readonly markerInfoSeparator = '\n';
    readonly layerName = 'vector';

    map: any;
    sites: SiteMarker[] = [];
    initialMarkerColor = LIGHT_BLUE;
    selectedMarkerColor = DARK_BLUE;
    selectedSite: null | Site = null;
    hoveredOverSite: null | Site = null;
    costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();
    unreachableSiteToIdsBySiteFromIdMap: Map<number, Site[]> = new Map<number, Site[]>();
    siteMarkerBySiteId: Map<number, SiteMarker> = new Map<number, SiteMarker>();

    componentDidUpdate() {
        if (this.props.sites?.length > 0 && this.props.costs?.length > 0) {
            // this.initData();
            // this.initMap();
        }
    }

    render() {
        const position = new LatLng(55.751244, 37.618423); // TODO: to constants

        return <div>
            {
                <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
                    </Marker>
                </MapContainer>
            }
        </div>
    }

    // initData(): void {
    //     this.costsBySiteFromIdMap = getCostsBySiteFromIdMap(this.props.costs);
    //     this.unreachableSiteToIdsBySiteFromIdMap = getUnreachableSiteToIdsBySiteFromIdMap(this.props.costs, this.props.sites);
    //     this.createSiteMarkersFromSites();
    // }

    // createSiteMarkersFromSites() {
    //     this.sites = getSites(this.props.sites) as SiteMarker[];
    //     this.sites.forEach(site => {
    //         this.siteMarkerBySiteId.set(site.siteId, site);
    //     });
    // }

    // initMap(): void {
    //     if (this.map) {
    //         // double check in debug fix
    //         return;
    //     }

    //     this.map = createMap();
    //     this.layer = this.createLayer();
    //     this.setUpMap();
    //     this.addMarkersToSites(this.sites);
    //     this.addMarkersToMap();
    // }

    // createLayer(): VectorLayer {
    //     return new VectorLayer(this.layerName).addTo(this.map);
    // }

    // setUpMap(): void {
    //     this.map.on('click', (e: any) => {
    //         if (this.hoveredOverSite) {
    //             // fix problem: click on marker === click on map
    //             return;
    //         }


    //         if (this.selectedSite) {
    //             this.setAllMarkersToInitState();
    //             this.resetSelectedSite();
    //         }
    //     });
    // }

    // addMarkersToSites(sites: SiteMarker[]) {
    //     createMarkersBySites(sites);
    // }

    // addMarkersToMap() {
    //     this.sites.map(site => site.marker).forEach(marker => marker.addTo(this.layer));
    //     this.sites.forEach(site => this.setMarkerMouseEvents(site));
    // }

    // setAllMarkersToInitState() {
    //     this.sites.map(site => site.marker).forEach(marker => {
    //         setMarkerColor(marker, this.initialMarkerColor);
    //         updateMarkerInfo(marker, '', this.layer);
    //     });
    // }

    // setMarkerMouseEvents(site: SiteMarker) {
    //     this.setOnMouseOverMarkerCallback(site);
    //     this.setOnMouseOutMarkerCallback(site);
    //     this.setOnMarkerClikCallback(site);
    // }

    // setOnMouseOverMarkerCallback(site: SiteMarker) {
    //     let onMouseOverMarkerFunc = this.getOnMouseOverFunc(site);
    //     // onMouseOverMarkerFunc = onMouseOverMarkerFunc.bind(this);
    //     // site.marker.on('mouseover', e => onMouseOverMarkerFunc(e));
    // }

    // setOnMouseOutMarkerCallback(site: SiteMarker) {
    //     let onMouseOutMarkerFunc = this.getOnMouseOutFunc(site);
    //     onMouseOutMarkerFunc = onMouseOutMarkerFunc.bind(this);
    //     // site.marker.on('mouseout', e => onMouseOutMarkerFunc(e));
    // }

    // setOnMarkerClikCallback(site: SiteMarker) {
    //     let onMarkerClickFunc = this.getOnMarkerClickFunc(site);
    //     onMarkerClickFunc = onMarkerClickFunc.bind(this);
    //     // site.marker.on('click', e => onMarkerClickFunc(e));
    // }

    // resetSelectedSite() {
    //     this.selectedSite = null;
    // }

    // getOnMouseOverFunc(site: Site) {
    // return (e: any) => {

    //     // fix multiple raise onmouseover event with maptalks markers
    //     if (this.isSiteHoveredOver(site) && site.siteId === this.hoveredOverSite?.siteId) {
    //         return;
    //     }

    //     // fix problem: click on marker === click on map
    //     this.hoveredOverSite = site;

    //     const marker = e.target as Marker;
    //     let markerInfo = this.getBasicSiteInfo(site);

    //     const cost = this.selectedSite ? getCostBetweenSites(this.selectedSite.siteId, site.siteId) : null;
    //     if (!this.isSiteSelected(site) && cost) {
    //         markerInfo = [markerInfo, this.getAdvancedSiteInfo(cost)].join(this.markerInfoSeparator);
    //     }

    //     updateMarkerInfo(
    //         marker,
    //         markerInfo,
    //         this.layer,
    //     );
    // };
    // }

    // isSiteSelected(site: Site) {
    //     return this.selectedSite && this.selectedSite.siteId === site.siteId;
    // }

    // isSiteHoveredOver(site: Site) {
    //     return this.hoveredOverSite && this.hoveredOverSite.siteId === site.siteId;
    // }

    // getAdvancedSiteInfo(cost: Cost) {
    //     return [
    //         `Агрегированные затраты: ${cost?.cost} мин.`,
    //         `Время ожидания: ${cost?.iwait} мин.`,
    //         `Время в салоне: ${cost?.inveht} мин.`,
    //         `Число пересадок: ${cost?.xnum}`,
    //         `Штраф за пересадки: ${cost?.xpen}`,
    //     ].join(this.markerInfoSeparator);
    // }

    // getOnMouseOutFunc(site: Site) {
    //     return (e: any) => {
    //         // const marker = e.target as Marker;

    //         // fix problem: click on marker === click on map
    //         this.hoveredOverSite = null;

    //         if (!this.isSiteSelected(site)) {
    //             // updateMarkerInfo(marker, '', this.layer);
    //             if (!this.selectedSite) {
    //                 // setMarkerColor(marker, this.initialMarkerColor);
    //             }
    //         }
    //     };
    // }

    // getOnMarkerClickFunc(site: SiteMarker) {
    //     return (e: any) => {
    //         // const marker = e.target as Marker;

    //         this.selectedSite = site;
    //         // setMarkerColor(marker, this.selectedMarkerColor);
    //         // updateMarkerInfo(marker, this.getBasicSiteInfo(site), this.layer);
    //         this.colorizeSitesTo(site);
    //         this.colorizeUnreachableSitesTo(site);
    //     };
    // }

    // getBasicSiteInfo(site: Site) {
    //     return [site.siteName,`id: ${site.siteId}` ].join(this.markerInfoSeparator);
    // }

    // colorizeSitesTo(siteFrom: SiteMarker) {
    // if (this.costsBySiteFromIdMap.has(siteFrom.siteId)) {
    //     const costs = this.costsBySiteFromIdMap.get(siteFrom.siteId) as Cost[];
    //     costs.forEach(cost => {
    //         const marker = this.siteMarkerBySiteId.get(cost.siteIdTo)?.marker as Marker;
    //         updateMarkerInfo(marker, '', this.layer);
    //         setMarkerColor(marker, this.getColorByCost(cost.cost));
    //     });
    // }
    // }

    // getColorByCost(cost: number) {
    //     if (cost < 5) {
    //         return GREEN;
    //     }
    //     if (cost < 15) {
    //         return YELLOW;
    //     }
    //     if (cost <= 30) {
    //         return RED;
    //     }
    //     if (cost > 30) {
    //         return DARK_PURPLE;
    //     }

    //     return BLACK;
    // }

    // colorizeUnreachableSitesTo(siteFrom: SiteMarker) {
    //     if (this.unreachableSiteToIdsBySiteFromIdMap.has(siteFrom.siteId)) {
    //         const unreachableSites = this.unreachableSiteToIdsBySiteFromIdMap.get(siteFrom.siteId) as Site[];
    //         unreachableSites.forEach(site => {
    //             const marker = this.sites.find(s => s.siteId === site.siteId)?.marker;
    //             if (marker) {
    //                 updateMarkerInfo(marker, '', this.layer);
    //                 setMarkerColor(marker, BLACK);
    //             }
    //         });
    //     }
    // }
}

const mapStateToProps = (state: BusWatcherState) => ({ costs: state.costs.costs, sites: state.sites.sites })

export default connect(mapStateToProps)(MapBrowser);


