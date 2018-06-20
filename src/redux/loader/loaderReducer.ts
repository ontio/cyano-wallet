import { Reducer } from 'redux';
import { FINISH_LOADING, START_LOADING } from './loaderActions';

export interface LoaderState {
    loading: boolean;
};

const defaultState: LoaderState = { loading: false };

export const loaderReducer: Reducer<LoaderState> = (state = defaultState, action) => {
    switch (action.type) {
    case START_LOADING:
        return {...state, loading: true };
    case FINISH_LOADING:
        return {...state, loading: false };
    default:
        return state;
    }
};
