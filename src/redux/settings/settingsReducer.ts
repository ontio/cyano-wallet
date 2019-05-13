import { Reducer } from "redux";
import { SET_SETTINGS, ADD_TOKEN, DEL_TOKEN } from "./settingsActions";
// import { testOpts } from "../../api/constants";

export type NetValue = "TEST" | "MAIN" | "PRIVATE";

export interface TokenState {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
  specification: "OEP-4";
}
export interface SettingsState {
  nodeAddress: string;
  ssl: boolean;
  net: NetValue;
  tokens: TokenState[];
}

const settingsCash = localStorage.getItem("settings");

const defaultState: SettingsState = (settingsCash && JSON.parse(settingsCash)) || {
  nodeAddress: "andromeda-sync.onyxpay.co",
  ssl: true,
  net: "MAIN",
  tokens: []
};

export const settingsReducer: Reducer<SettingsState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      localStorage.setItem(
        "settings",
        JSON.stringify({
          nodeAddress: action.nodeAddress,
          ssl: action.ssl,
          net: action.net,
          tokens: action.tokens
        })
      );
      return {
        ...state,
        nodeAddress: action.nodeAddress,
        ssl: action.ssl,
        net: action.net,
        tokens: action.tokens
      };
    case ADD_TOKEN:
      localStorage.setItem(
        "settings",
        JSON.stringify({
          ...state,
          tokens: [
            ...state.tokens.filter(token => token.contract !== action.contract),
            {
              contract: action.contract,
              decimals: action.decimals,
              name: action.name,
              specification: action.specification,
              symbol: action.symbol
            }
          ]
        })
      );

      return {
        ...state,
        tokens: [
          ...state.tokens.filter(token => token.contract !== action.contract),
          {
            contract: action.contract,
            decimals: action.decimals,
            name: action.name,
            specification: action.specification,
            symbol: action.symbol
          }
        ]
      };
    case DEL_TOKEN:
      localStorage.setItem(
        "settings",
        JSON.stringify({
          ...state,
          tokens: [...state.tokens.filter(token => token.contract !== action.contract)]
        })
      );
      return {
        ...state,
        tokens: state.tokens.filter(token => token.contract !== action.contract)
      };
    default:
      return state;
  }
};

export function compareSettings(a: SettingsState | null, b: SettingsState | null): boolean {
  if (a === b) {
    return true;
  } else if (a == null || b == null) {
    return false;
  } else {
    return a.net === b.net && a.ssl === b.ssl && a.nodeAddress === b.nodeAddress;
  }
}
