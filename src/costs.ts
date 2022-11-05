import Axios from 'axios';
import COLORS from './common/constants/colors'
import { SiteMarker } from './markers'
import { Dispatch } from 'redux';
import HttpResponse from './common/interfaces/httpResponse';
import { RootState } from '.';
import { createSelector } from 'reselect';
import { sitesSelector } from './store/sites';
import { Site } from './sites';

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

export const GET_COSTS_START = 'GET_COSTS_START';
export const GET_COSTS_SUCCESS = 'GET_COSTS_SUCCESS';
export const GET_COSTS_ERROR = 'GET_COSTS_ERROR';

const initialState: CostState = {
    costs: [],
    loading: false,
    error: null,
};

export const getCostsStart = () => ({
    type: GET_COSTS_START,
})

export const getCostsSuccess = (data: Cost[]) => ({
    type: GET_COSTS_SUCCESS,
    payload: data,
})

export const getCostsError = (error: any) => ({
    type: GET_COSTS_ERROR,
    error,
})

export interface GetCostsStartAction {
    type: typeof GET_COSTS_START
}

export interface GetCostsSuccessAction {
    type: typeof GET_COSTS_SUCCESS
    payload: Cost[]
}

export interface GetCostsErrorAction {
    type: typeof GET_COSTS_ERROR
    error: any
}

export type CostsActionTypes =
GetCostsStartAction
| GetCostsSuccessAction
| GetCostsErrorAction

export const fetchCosts = () => async (dispatch: Dispatch): Promise<void> => {
    dispatch(getCostsStart());
    try {
        const url = (process.env.REACT_APP_BACK_URL || 'http://localhost:9001') + (process.env.REACT_APP_FETCH_COSTS_URL || '');
        const response = await Axios.get(url) as HttpResponse;
        dispatch(getCostsSuccess(response.data));
    } catch (error) {
        dispatch(getCostsError(error));
    }
}

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

export const costsSelector = (state: RootState) => state.costs.costs; // may be state?

export const getCostsBySiteFromId = createSelector(
    [costsSelector],
    (costs: Cost[]): Map<number, Cost[]> => {
        const _costsBySiteFromIdMap = new Map<number, Cost[]>();
        costs.forEach(cost => {
            const key = cost.siteIdFrom;
            if (!_costsBySiteFromIdMap.has(key)) {
                _costsBySiteFromIdMap.set(key, [cost]);
            } else {
                const currentValue = _costsBySiteFromIdMap.get(key) as Cost[];
                _costsBySiteFromIdMap.set(key, [cost, ...currentValue]);
            }
        });

        return _costsBySiteFromIdMap;
    },
)

export const getUnreachableSitesByIdFrom = createSelector(
    [sitesSelector, getCostsBySiteFromId],
    (sites: Site[], costsBySiteFromId: Map<number, Cost[]>): Map<number, Site[]> => {
        console.time('getUnreachableSitesByIdFrom');
        const unreachableSitesBySiteFromId = new Map<number, Site[]>();

        sites.forEach(site => {
            if (!Array.from(costsBySiteFromId.keys()).find(key => key === site.siteId)) {
                unreachableSitesBySiteFromId.set(site.siteId, sites.filter(s => s.siteId !== site.siteId));
            }
        });

        Array.from(costsBySiteFromId.entries()).forEach(entry => {
            const [key, costs] = entry;

            if (costs.length < sites.length) {
                const unreachableSites = sites.filter(site => !costs.map(cost => cost.siteIdTo).includes(site.siteId));
                unreachableSitesBySiteFromId.set(key, unreachableSites.filter(site => site.siteId !== key));
            }
        });

        console.timeEnd('getUnreachableSitesByIdFrom');
        return unreachableSitesBySiteFromId;
    },
)


export default CostsReducer;
