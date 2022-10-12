import React from 'react';
import './index.scss';
import App from './App';

import 'bootstrap/dist/css/bootstrap.css';
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import CostsReducer from './store/costs';
import SitesReducer from './store/sites';
import ReactDOM from 'react-dom';

// const root = ReactDOM.createRoot(
// document.getElementById('root') as HTMLElement,
// );

const busWatcherReducer = combineReducers({
    costs: CostsReducer,
    sites: SitesReducer,
})
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(busWatcherReducer, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);

export type BusWatcherState = ReturnType<typeof busWatcherReducer>
