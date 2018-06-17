import { Reducer } from 'redux';
import { SIGN_IN } from './authActions';

export interface AuthState {
    wallet: object | null;
    password: string | null;
};

const defaultState: AuthState = { wallet: null, password: null };

export const authReducer: Reducer<AuthState> = (state = defaultState, action) => {
    switch (action.type) {
    case SIGN_IN:
        return {...state, wallet: action.wallet, password: action.password };
    default:
        return state;
    }
};