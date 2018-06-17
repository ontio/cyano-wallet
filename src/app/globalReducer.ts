import { combineReducers } from 'redux';
import { authReducer, AuthState } from '../auth/authReducer';
import { loaderReducer, LoaderState } from '../loader/loaderReducer';

export const globalReducer = combineReducers({
    auth: authReducer,
    loader: loaderReducer
});

export interface GlobalState {
    auth: AuthState;
    loader: LoaderState;
};