import { Cost } from '../data/costsData';
import Axios from 'axios';
import { Dispatch } from 'redux';
import HttpResponse from '../common/interfaces/httpResponse';

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

export const GET_COSTS_START = 'GET_COSTS_START';
export const GET_COSTS_SUCCESS = 'GET_COSTS_SUCCESS';
export const GET_COSTS_ERROR = 'GET_COSTS_ERROR';

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
