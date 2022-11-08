import React from 'react';
import './index.scss';

import 'bootstrap/dist/css/bootstrap.css';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import CostsReducer from './costs';
import SitesReducer from './sites';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

const busWatcherReducer = combineReducers({
    costs: CostsReducer,
    sites: SitesReducer,
})

const store = configureStore({
    reducer: busWatcherReducer,
})

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

