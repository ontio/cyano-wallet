import { Reducer } from "redux";

export type AssetType = "ONYX" | "OXG" | string;

export interface Transfer {
  amount: string;
  asset: AssetType;
  from: string;
  to: string;
  time: number;
}

export interface TokenAmountState {
  contract: string;
  amount: string;
  symbol: string;
}

export interface RuntimeState {
  ongAmount: number;
  ontAmount: number;

  unboundAmount: number;
  transfers: Transfer[] | null;

  tokenAmounts: TokenAmountState[];
}

export const SET_BALANCE = "SET_BALANCE";
export const SET_TRANSFERS = "SET_TRANSFERS";

const defaultState: RuntimeState = {
  ongAmount: 0,
  ontAmount: 0,
  unboundAmount: 0,
  transfers: [],
  tokenAmounts: []
};

export const runtimeReducer: Reducer<RuntimeState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_BALANCE:
      return {
        ...state,
        ongAmount: action.ongAmount,
        ontAmount: action.ontAmount,
        unboundAmount: action.unboundAmount,
        tokenAmounts: action.tokenAmounts
      };
    case SET_TRANSFERS:
      return { ...state, transfers: action.transfers };
    default:
      return state;
  }
};

export const setBalance = (
  ongAmount: string,
  ontAmount: string,
  unboundAmount: number,
  tokenAmounts: TokenAmountState[]
) => ({ type: SET_BALANCE, ongAmount, ontAmount, unboundAmount, tokenAmounts });

export const setTransfers = (transfers: Transfer[]) => ({ type: SET_TRANSFERS, transfers });
