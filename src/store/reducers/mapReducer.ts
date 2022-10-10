export interface MapState {
    showInstruction: boolean
}

const initState: MapState = {
    showInstruction: false,
}

// eslint-disable-next-line arrow-body-style
const MapReducer = (state = initState) => {
    return state;
}

export default MapReducer;
