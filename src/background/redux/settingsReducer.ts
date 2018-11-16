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
import { Reducer } from 'redux';
import { ADD_TOKEN, DEL_TOKEN, SET_SETTINGS, SettingsState } from '../../redux/settings';

const defaultState: SettingsState = { address: 'dapp1.ont.io', ssl: false, net: 'MAIN', tokens: [] };
export const settingsReducer: Reducer<SettingsState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SETTINGS:
      return { ...state, address: action.address, ssl: action.ssl, net: action.net, tokens: action.tokens };
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
          },
        ],
      };
    case DEL_TOKEN:
      return {
        ...state,
        tokens: state.tokens.filter((token) => token.contract !== action.contract),
      };
    default:
      return state;
  }
};
