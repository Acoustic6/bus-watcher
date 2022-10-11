import React from 'react';
import MapBrowser from './components/MapBrowser';
import NavBar from './components/navBar';

const App = () => <React.Fragment>
    <NavBar />
    <main className="container">
        <MapBrowser />
    </main>
</React.Fragment>;

export default App;
