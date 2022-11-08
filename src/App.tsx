import React, { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '.';
import MapBrowser from './components/MapBrowser';
import { fetchCosts } from './costs';
import { fetchSites } from './sites';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchCosts());
        dispatch(fetchSites());
    }, []);

    const position = { lat: 55.77193853272883, lng: 37.60620117187501 }; // TODO: to constants

    return <React.Fragment>
        <main className="container" style={{ padding: '0 !important' }}>
            <div style={{ height: '100%', width: '100%' }}>
                {
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        attributionControl={false}
                        center={position}
                        zoom={12}
                        scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapBrowser />
                    </MapContainer>

                }
            </div>
        </main>
    </React.Fragment>
}

export default App;
