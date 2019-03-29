/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
// import { CONST } from "ontology-ts-sdk";
import { Reducer } from "redux";
import { SET_SETTINGS, ADD_TOKEN, DEL_TOKEN } from "./settingsActions";

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
  nodeAddress: "35.178.63.10", // TODO: get from consts
  ssl: false,
  net: "TEST",
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
