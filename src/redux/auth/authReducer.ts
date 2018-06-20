import { Reducer } from 'redux';
import { CLEAR_WALLET, SET_WALLET } from './authActions';

export interface AuthState {
  wallet: object | null;
};

const defaultState: AuthState = { wallet: null };

export const authReducer: Reducer<AuthState> = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_WALLET:
      return { ...state, wallet: null };
    case SET_WALLET:
      return { ...state, wallet: action.wallet };
    default:
      return state;
  }
};
