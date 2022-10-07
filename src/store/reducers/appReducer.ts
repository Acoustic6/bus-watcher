export interface MapState {
    showInstruction: boolean
}

const initState: MapState = {
    showInstruction: false,
}

// eslint-disable-next-line arrow-body-style
const map = (state = initState) => {
    return state;
}

export default map;
