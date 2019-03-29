import { TokenState } from "./settingsReducer";

export const SET_SETTINGS = "SET_SETTINGS";
export const ADD_TOKEN = "ADD_TOKEN";
export const DEL_TOKEN = "DEL_TOKEN";

export const setSettings = (nodeAddress: string, ssl: boolean, net: string | null, tokens: TokenState[]) => ({
  type: SET_SETTINGS,
  nodeAddress,
  ssl,
  net,
  tokens
});

export const addToken = (contract: string, name: string, symbol: string, decimals: number, specification: "OEP-4") => ({
  type: ADD_TOKEN,
  contract,
  name,
  symbol,
  decimals,
  specification
});

export const delToken = (contract: string) => ({ type: DEL_TOKEN, contract });
