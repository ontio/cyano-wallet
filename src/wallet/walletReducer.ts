import { Reducer } from 'redux';
import { SET_BALANCE } from './walletActions';

export interface WalletState {
    ongAmount: number;
    ontAmount: number;
};

const defaultState: WalletState = { ongAmount: 0, ontAmount: 0 };

export const walletReducer: Reducer<WalletState> = (state = defaultState, action) => {
    switch (action.type) {
    case SET_BALANCE:
        return {...state, ongAmount: action.ongAmount, ontAmount: action.ontAmount };
    default:
        return state;
    }
};
