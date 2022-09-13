import React,{ useState } from 'react';
import './App.scss';
import MapBrowser from './components/MapBrowser';
import NavBar from './components/navBar';

const App = () => {
  const [zIndex, setzIndex] = useState(0);

  return <React.Fragment>
    <NavBar />
    <main className="container">
      <div id="status" style={{ zIndex }}></div>
      <MapBrowser setZIndex={setzIndex} />
    </main>
  </React.Fragment>;

};

export default App;
