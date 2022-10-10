import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import MapReducer from './store/map';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import CostsReducer from './store/costs';
import SitesReducer from './store/sites';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const busWatcherReducer = combineReducers({
    map: MapReducer,
    costs: CostsReducer,
    sites: SitesReducer,
})
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(busWatcherReducer, composeEnhancers(applyMiddleware(thunk)));

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
);
