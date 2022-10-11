import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { BusWatcherState } from '.';
import MapBrowser from './components/MapBrowser';
import NavBar from './components/navBar';
import { fetchCosts } from './store/costs';
import { fetchSites } from './store/sites';

const App = (props: DispatchProps) => {
    useEffect(() => {
        props.actions.handleFetchCosts();
        props.actions.handleFetchSites();
    });

    return <React.Fragment>
        <NavBar />
        <main className="container">
            <MapBrowser actions={props.actions}/>
        </main>
    </React.Fragment>
}
interface DispatchProps {
    actions: {
        handleFetchCosts: () => void
        handleFetchSites: () => void
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<BusWatcherState, void, AnyAction>): DispatchProps => ({
    actions: {
        handleFetchCosts: () => dispatch(fetchCosts()),
        handleFetchSites: () => dispatch(fetchSites()),
    },
})

export default connect(null, mapDispatchToProps)(App);
