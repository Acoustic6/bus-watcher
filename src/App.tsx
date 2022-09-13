import * as React from 'react';
import './App.scss';
import MapBrowser from './components/MapBrowser';
import NavBar from './components/navBar';
import { Route, Switch } from 'react-router-dom';


const App = () => (
  <React.Fragment>
    <NavBar />
    <main className="container">
      <Switch>
        <Route path='/' render={props => <MapBrowser data='' {...props}/>} />
      </Switch>
    </main>
  </React.Fragment>

);

export default App;
