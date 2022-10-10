import Axios from 'axios';
import { Dispatch } from 'redux';
import HttpResponse from '../../common/interfaces/httpResponse';
import { Site } from '../../data/sitesData';

export type SiteState = Readonly<{
    sites: Site[]
    loading: boolean
    error: any
}>

const initialState: SiteState = {
    sites: [],
    loading: false,
    error: null,
};

export const GET_SITES_START = 'GET_SITES_START';
export const GET_SITES_SUCCESS = 'GET_SITES_SUCCESS';
export const GET_SITES_ERROR = 'GET_SITES_ERROR';

export interface GetSitesStartAction {
    type: typeof GET_SITES_START
}

export interface GetSitesSuccessAction {
    type: typeof GET_SITES_SUCCESS
    payload: Site[]
}

export interface GetSitesErrorAction {
    type: typeof GET_SITES_ERROR
    error: any
}

export const getSitesStart = () => ({
    type: GET_SITES_START,
})

export const getSitesSuccess = (data: Site[]) => ({
    type: GET_SITES_SUCCESS,
    payload: data,
})

export const getSitesError = (error: any) => ({
    type: GET_SITES_ERROR,
    error,
})

export type SitesActionTypes =
GetSitesStartAction
| GetSitesSuccessAction
| GetSitesErrorAction

export const fetchSites = () => async (dispatch: Dispatch): Promise<void> => {
    dispatch(getSitesStart());
    try {
        const url = (process.env.REACT_APP_BACK_URL || 'http://localhost:9001') + (process.env.REACT_APP_FETCH_SITES_URL || '');
        const response = await Axios.get(url) as HttpResponse;
        dispatch(getSitesSuccess(response.data));
    } catch (error) {
        dispatch(getSitesError(error));
    }
}

const SitesReducer = (state = initialState, action: SitesActionTypes) => {
    switch (action.type) {
        case GET_SITES_START:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case GET_SITES_SUCCESS:
            return {
                ...state,
                loading: false,
                sites: action.payload,
            }
        case GET_SITES_ERROR:
            return {
                ...state,
                loading: false,
                sites: [],
                error: action.error,
            }
        default:
            return state;
    }
}

export default SitesReducer;
