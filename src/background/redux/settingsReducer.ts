/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Reducer } from 'redux';
import {
  ADD_TOKEN,
  ADD_TRUSTED_SC,
  DEL_TOKEN,
  DEL_TRUSTED_SC,
  SET_SETTINGS,
  SettingsState,
} from '../../redux/settings';

const defaultState: SettingsState = { address: 'dapp1.ont.io', ssl: false, net: 'MAIN', tokens: [], trustedScs: [] };
export const settingsReducer: Reducer<SettingsState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return {
        ...state,
        address: action.address,
        net: action.net,
        ssl: action.ssl,
        tokens: action.tokens,
        trustedScs: action.trustedScs,
      };
    case ADD_TOKEN:
      return {
        ...state,
        tokens: [
          ...state.tokens.filter((token) => token.contract !== action.contract),
          {
            contract: action.contract,
            decimals: action.decimals,
            name: action.name,
            specification: action.specification,
            symbol: action.symbol,
            vmType: action.vmType
          },
        ],
      };
    case ADD_TRUSTED_SC:
      return {
        ...state,
        trustedScs: [
          ...state.trustedScs.filter((sc) => sc.name !== action.name),
          {
            confirm: action.confirm,
            contract: action.contract,
            method: action.method,
            name: action.name,
            paramsHash: action.paramsHash,
            password: action.password,
            trustedFileHash: action.trustedFileHash
          },
        ],
      };
    case DEL_TOKEN:
      return {
        ...state,
        tokens: state.tokens.filter((token) => token.contract !== action.contract),
      };
    case DEL_TRUSTED_SC:
      return {
        ...state,
        trustedScs: state.trustedScs.filter((sc) => sc.name !== action.name),
      };
    default:
      return state;
  }
};
