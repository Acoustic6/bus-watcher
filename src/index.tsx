import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import { applyMiddleware, createStore } from 'redux';
import map from './store/reducers/appReducer';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const store = createStore(map, applyMiddleware(thunk));

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
);
