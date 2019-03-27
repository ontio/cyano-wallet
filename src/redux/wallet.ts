import { Reducer } from "redux";
import { Wallet } from "ontology-ts-sdk";

export interface WalletState {
  wallet: Wallet | null;
}

export const SET_WALLET = "SET_WALLET";
export const CLEAR_WALLET = "CLEAR_WALLET";

export const setWallet = (walletEncoded: string) => ({ type: SET_WALLET, wallet: JSON.parse(walletEncoded) });
export const clearWallet = () => ({ type: CLEAR_WALLET });

const walletCash = localStorage.getItem("wallet");
// TODO: move seperate reducer
const defaultState: WalletState = { wallet: (walletCash && JSON.parse(walletCash)) || null };

export const walletReducer: Reducer<WalletState> = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_WALLET:
      return { ...state, wallet: null };
    case SET_WALLET:
      localStorage.setItem("wallet", JSON.stringify(action.wallet));
      return { ...state, wallet: action.wallet };
    default:
      return state;
  }
};
