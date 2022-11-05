import COLORS from './common/constants/colors'
import { SiteMarker } from './markers'
import { GetCostsErrorAction, GetCostsStartAction, GetCostsSuccessAction, GET_COSTS_ERROR, GET_COSTS_START, GET_COSTS_SUCCESS } from './store/costs'

export interface Cost {
    siteIdFrom: number
    siteIdTo: number
    iwait: number
    inveht: number
    xwait: number
    xpen: number
    xnum: number
    cost: number
}

export type CostState = Readonly<{
    costs: Cost[]
    loading: boolean
    error: any
}>

const initialState: CostState = {
    costs: [],
    loading: false,
    error: null,
};

export type CostsActionTypes =
GetCostsStartAction
| GetCostsSuccessAction
| GetCostsErrorAction

export const getColor = (marker: SiteMarker) => {
    if (marker.cost?.cost) {
        return getColorByCost(marker);
    }
    return marker.isSelected ? COLORS.DARK_BLUE : COLORS.LIGHT_BLUE;
}

export const getColorByCost = (marker: SiteMarker) => {
    const cost = marker?.cost?.cost ?? -1;

    if (cost === -1) {
        return COLORS.LIGHT_BLUE;
    }
    if (cost < 5) {
        return COLORS.GREEN;
    }
    if (cost < 15) {
        return COLORS.YELLOW;
    }
    if (cost <= 30) {
        return COLORS.RED;
    }
    if (cost > 30) {
        return COLORS.DARK_PURPLE;
    }


    return COLORS.BLACK;
}

const CostsReducer = (state = initialState, action: CostsActionTypes) => {
    switch (action.type) {
        case GET_COSTS_START:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case GET_COSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                costs: action.payload,
            }
        case GET_COSTS_ERROR:
            return {
                ...state,
                loading: false,
                costs: [],
                error: action.error,
            }
        default:
            return state;
    }
}

export default CostsReducer;
