import * as React from 'react';
import { Component } from 'react';
import { Marker, VectorLayer, LineString } from 'maptalks';
import 'maptalks/dist/maptalks.css';
import createMap from '../services/mapService';
import createMarkersBySites, { setMarkerColor, updateMarkerInfo } from '../services/markerService';
import getCostsBySiteFromIdMap, { getCostBetweenSites } from '../services/costService';
import { Site } from '../data/sitesData';
import { BLACK, DARK_BLUE, DARK_PURPLE, GREEN, LIGHT_BLUE, RED, YELLOW } from '../common/constants/colors';
import { Cost } from '../data/costsData';
import getSites, { getUnreachableSiteToIdsBySiteFromIdMap } from '../services/siteService';
import { addLinesToLayer, endEditForAllLines, getClickedRoute, hideRoutes, startEdit } from '../services/linesService';
import createDrawTool from '../services/drawService';
import createMenu from '../services/menuService';
import { ThunkDispatch } from 'redux-thunk';
import { MapState } from '../store/reducers/mapReducer';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { fetchCosts } from '../store/costs/costs';
import { fetchSites } from '../store/sites/sites';

interface MapBrowserProps {
    setZIndex: any
}

interface DispatchProps {
    actions: {
        handleFetchCosts: () => void
        handleFetchSites: () => void
    }
}

export type SiteMarker = Site & {
    marker: Marker
}

interface OwnProps {
    children?: React.ReactChild
}

interface DispatchProps {
    actions: {
        handleFetchCosts: () => void
        handleFetchSites: () => void
    }
}

class MapBrowser extends Component<OwnProps & DispatchProps & MapBrowserProps> {
    readonly markerInfoSeparator = '\n';
    readonly layerName = 'vector';

    map: any;
    layer: VectorLayer;
    sites: SiteMarker[] = [];
    initialMarkerColor = LIGHT_BLUE;
    selectedMarkerColor = DARK_BLUE;
    selectedSite: null | Site = null;
    hoveredOverSite: null | Site = null;
    costsBySiteFromIdMap: Map<number, Cost[]> = new Map<number, Cost[]>();
    unreachableSiteToIdsBySiteFromIdMap: Map<number, Site[]> = new Map<number, Site[]>();
    siteMarkerBySiteId: Map<number, SiteMarker> = new Map<number, SiteMarker>();

    componentDidMount() {
        this.props.actions.handleFetchCosts();
        this.props.actions.handleFetchSites();

        this.initData(); // remove?
        this.initMap();
    }

    render() {
        return <React.Fragment>
            <div id="map"></div>
        </React.Fragment>;
    }

    initData(): void {
        this.costsBySiteFromIdMap = getCostsBySiteFromIdMap();
        this.unreachableSiteToIdsBySiteFromIdMap = getUnreachableSiteToIdsBySiteFromIdMap();
        this.createSiteMarkersFromSites();
    }

    createSiteMarkersFromSites() {
        this.sites = getSites() as SiteMarker[];
        this.sites.forEach(site => {
            this.siteMarkerBySiteId.set(site.siteId, site);
        });
    }

    initMap(): void {
        if (this.map) {
            // double check in debug fix
            return;
        }

        this.map = createMap();
        this.layer = this.createLayer();
        this.setUpMap();
        this.addMarkersToSites(this.sites);
        this.addMarkersToMap();
        this.addRoutesToMap();
        const drawTool = createDrawTool(this.map, this.layer);
        createMenu(this.layer, this.map, drawTool, this.props.setZIndex);
        hideRoutes();
    }

    createLayer(): VectorLayer {
        return new VectorLayer(this.layerName).addTo(this.map);
    }

    setUpMap(): void {
        this.map.on('click', (e: any) => {
            const clickedRoute = getClickedRoute(e.coordinate);
            if (this.hoveredOverSite && !clickedRoute) {
                // fix problem: click on marker === click on map
                return;
            }

            if (clickedRoute) {
                const line = clickedRoute as LineString;
                startEdit(line);
            } else {
                endEditForAllLines();
            }

            if (this.selectedSite) {
                this.setAllMarkersToInitState();
                this.resetSelectedSite();
            }

            this.props.setZIndex(-1);
        });
    }

    addMarkersToSites(sites: SiteMarker[]) {
        createMarkersBySites(sites);
    }

    addRoutesToMap() {
        addLinesToLayer(this.layer);
    }

    addMarkersToMap() {
        this.sites.map(site => site.marker).forEach(marker => marker.addTo(this.layer));
        this.sites.forEach(site => this.setMarkerMouseEvents(site));
    }

    setAllMarkersToInitState() {
        this.sites.map(site => site.marker).forEach(marker => {
            setMarkerColor(marker, this.initialMarkerColor);
            updateMarkerInfo(marker, '', this.layer);
        });
    }

    setMarkerMouseEvents(site: SiteMarker) {
        this.setOnMouseOverMarkerCallback(site);
        this.setOnMouseOutMarkerCallback(site);
        this.setOnMarkerClikCallback(site);
    }

    setOnMouseOverMarkerCallback(site: SiteMarker) {
        let onMouseOverMarkerFunc = this.getOnMouseOverFunc(site);
        onMouseOverMarkerFunc = onMouseOverMarkerFunc.bind(this);
        site.marker.on('mouseover', e => onMouseOverMarkerFunc(e));
    }

    setOnMouseOutMarkerCallback(site: SiteMarker) {
        let onMouseOutMarkerFunc = this.getOnMouseOutFunc(site);
        onMouseOutMarkerFunc = onMouseOutMarkerFunc.bind(this);
        site.marker.on('mouseout', e => onMouseOutMarkerFunc(e));
    }

    setOnMarkerClikCallback(site: SiteMarker) {
        let onMarkerClickFunc = this.getOnMarkerClickFunc(site);
        onMarkerClickFunc = onMarkerClickFunc.bind(this);
        site.marker.on('click', e => onMarkerClickFunc(e));
    }

    resetSelectedSite() {
        this.selectedSite = null;
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

    isSiteSelected(site: Site) {
        return this.selectedSite && this.selectedSite.siteId === site.siteId;
    }

    isSiteHoveredOver(site: Site) {
        return this.hoveredOverSite && this.hoveredOverSite.siteId === site.siteId;
    }

    getAdvancedSiteInfo(cost: Cost) {
        return [
            `Агрегированные затраты: ${cost?.cost} мин.`,
            `Время ожидания: ${cost?.iwait} мин.`,
            `Время в салоне: ${cost?.inveht} мин.`,
            `Число пересадок: ${cost?.xnum}`,
            `Штраф за пересадки: ${cost?.xpen}`,
        ].join(this.markerInfoSeparator);
    }

    getOnMouseOutFunc(site: Site) {
        return (e: any) => {
            const marker = e.target as Marker;

            // fix problem: click on marker === click on map
            this.hoveredOverSite = null;

            if (!this.isSiteSelected(site)) {
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
            this.colorizeSitesTo(site);
            this.colorizeUnreachableSitesTo(site);
        };
    }

    getBasicSiteInfo(site: Site) {
        return [site.siteName,`id: ${site.siteId}` ].join(this.markerInfoSeparator);
    }

    colorizeSitesTo(siteFrom: SiteMarker) {
        if (this.costsBySiteFromIdMap.has(siteFrom.siteId)) {
            const costs = this.costsBySiteFromIdMap.get(siteFrom.siteId) as Cost[];
            costs.forEach(cost => {
                const marker = this.siteMarkerBySiteId.get(cost.siteIdTo)?.marker as Marker;
                updateMarkerInfo(marker, '', this.layer);
                setMarkerColor(marker, this.getColorByCost(cost.cost));
            });
        }
    }

    getColorByCost(cost: number) {
        if (cost < 5) {
            return GREEN;
        }
        if (cost < 15) {
            return YELLOW;
        }
        if (cost <= 30) {
            return RED;
        }
        if (cost > 30) {
            return DARK_PURPLE;
        }

        return BLACK;
    }

    colorizeUnreachableSitesTo(siteFrom: SiteMarker) {
        if (this.unreachableSiteToIdsBySiteFromIdMap.has(siteFrom.siteId)) {
            const unreachableSites = this.unreachableSiteToIdsBySiteFromIdMap.get(siteFrom.siteId) as Site[];
            unreachableSites.forEach(site => {
                const marker = this.sites.find(s => s.siteId === site.siteId)?.marker;
                if (marker) {
                    updateMarkerInfo(marker, '', this.layer);
                    setMarkerColor(marker, BLACK);
                }
            });
        }
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<MapState, void, AnyAction>): DispatchProps {
    return {
        actions: {
            handleFetchCosts: () => dispatch(fetchCosts()),
            handleFetchSites: () => dispatch(fetchSites()),
        },
    };
}

export default connect(null, mapDispatchToProps)(MapBrowser);


