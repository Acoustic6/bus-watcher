import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { RootState } from '..';
import COLORS from '../common/constants/colors';
import { getColor } from '../costs';
import { getSeparatedSiteMarkers, getSiteMarkersById, makeMarkerDefault, makeMarkersDefault, makeMarkerSelected, setMarkerColor, SiteMarker } from '../markers';
import { getCostsBySiteFromId, getUnreachableSitesByIdFrom } from '../store/costs';

const MapBrowser = () => {
    const siteMarkers = useSelector((state: RootState) => getSeparatedSiteMarkers(state));
    const markersById = useSelector((state: RootState) => getSiteMarkersById(state));
    const costsById = useSelector((state: RootState) => getCostsBySiteFromId(state));
    const unreachableSites = useSelector((state: RootState) => getUnreachableSitesByIdFrom(state));

    const [selectedMarker, setSelectedMarker] = useState(null as SiteMarker | null);
    const [markers, setMarkers] = useState([] as SiteMarker[]);

    const map = useMapEvents({
        click: () => {
            console.log('map');
            makeMarkersDefault(markers);
            setSelectedMarker(null);
            setMarkers(markers);
        },
    })

    useEffect(() => {
        setMarkers(siteMarkers);
    },[siteMarkers])


    const handleMarkerClick = (marker: SiteMarker) => {
        updateMarkers(marker);
    }

    const updateMarkers = (clickedMarker: SiteMarker) => {
        if (selectedMarker?.siteId === clickedMarker.siteId) {
            return;
        }

        if (selectedMarker) {
            makeMarkerDefault(selectedMarker)
            markersById.set(selectedMarker.siteId, selectedMarker);
        }

        makeMarkerSelected(clickedMarker);
        markersById.set(clickedMarker.siteId, clickedMarker);
        setSelectedMarker(clickedMarker);


        const costs = costsById.get(clickedMarker.siteId);
        if (costs) {
            costs.forEach(cost => {
                const markerTo = markersById.get(cost.siteIdTo);
                if (markerTo !== undefined) {
                    markerTo.cost = cost;
                    markersById.set(markerTo.siteId, markerTo);
                }
            });
        }
        setMarkers(Array.from(markersById.values()));
    }

    const setMarkerTooltips = (markers: SiteMarker[]): void => {
        for (const marker of markers) {
            setMarkerTooltip(marker);
        }
    }

    const setMarkerColors = (markers: SiteMarker[]): void => {
        for (const marker of markers) {
            let color = getColor(marker);
            if (selectedMarker) {
                const unreachables = unreachableSites.get(selectedMarker?.siteId);
                if (unreachables !== undefined && unreachables.map(s => s.siteId).includes(marker.siteId)) {
                    color = COLORS.BLACK
                }
            }
            setMarkerColor(marker, color);
        }
    }

    const setMarkerTooltip = (marker: SiteMarker): void => {
        if (selectedMarker && !marker?.isSelected && marker.cost) {
            marker.tooltip = <Tooltip>
                <div>{`Агрегированные затраты: ${marker.cost?.cost} мин.`}</div>
                <div>{`Время ожидания: ${marker.cost?.iwait} мин.`}</div>
                <div>{`Время в салоне: ${marker.cost?.inveht} мин.`}</div>
                <div>{`Число пересадок: ${marker.cost?.xnum}`}</div>
                <div>{`Штраф за пересадки: ${marker.cost?.xpen}`}</div>
            </Tooltip>
        } else {
            marker.tooltip = <Tooltip>
                <div>{marker.siteName}</div>
                <div>{`Id: ${marker.siteId}`}</div>
            </Tooltip>
        }
    }

    setMarkerTooltips(markers);
    setMarkerColors(markers);

    return <React.Fragment>
        {markers.map(marker =>
            <CircleMarker
                key={marker.siteId}
                center={[marker.latitude, marker.longitude]}
                bubblingMouseEvents={false}
                pathOptions={{
                    color: marker.borderColor,
                    fillColor: marker.color,
                    fillOpacity: 1 ,
                }}
                eventHandlers={{
                    click: (event: any) => {
                        event.originalEvent.stopPropagation();
                        handleMarkerClick(marker);
                    },
                }}
            >
                {marker?.tooltip ?? <></>}
            </CircleMarker>)
        }
    </React.Fragment>
}

export default MapBrowser;


