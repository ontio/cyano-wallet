import { Reducer } from 'redux';
import { Transfer } from '../../api/explorerApi';
import { SET_BALANCE, SET_TRANSFERS } from './walletActions';

export interface WalletState {
  ongAmount: number;
  ontAmount: number;
  transfers: Transfer[] | null;
};

const defaultState: WalletState = { ongAmount: 0, ontAmount: 0, transfers: null };

export const walletReducer: Reducer<WalletState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_BALANCE:
      return { ...state, ongAmount: action.ongAmount, ontAmount: action.ontAmount };
    case SET_TRANSFERS:
      return { ...state, transfers: action.transfers };
    default:
      return state;
  }
};
