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

import { VmType } from '@ont-dev/ontology-dapi';

export type NetValue = 'TEST' | 'MAIN' | 'PRIVATE';

// tslint:disable:object-literal-sort-keys

export interface TokenState {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
  specification: 'OEP-4';
}

export interface TrustedSc {
  contract: string;
  method?: string;
  paramsHash?: string;
  name: string;
  password: boolean;
  confirm: boolean;
}

export interface SettingsState {
  net: NetValue;
  address: string;
  ssl: boolean;

  tokens: TokenState[];
  trustedScs: TrustedSc[];
}

export const SET_SETTINGS = 'SET_SETTINGS';

export const ADD_TOKEN = 'ADD_TOKEN';

export const DEL_TOKEN = 'DEL_TOKEN';

export const ADD_TRUSTED_SC = 'ADD_TRUSTED_SC';

export const DEL_TRUSTED_SC = 'DEL_TRUSTED_SC';

export const setSettings = (
  address: string,
  ssl: boolean,
  net: string | null,
  tokens: TokenState[],
  trustedScs: TrustedSc[],
) => ({
  type: SET_SETTINGS,
  address,
  ssl,
  net,
  tokens,
  trustedScs,
});

export const addToken = (contract: string, name: string, symbol: string, decimals: number, specification: 'OEP-4') => ({
  type: ADD_TOKEN,
  contract,
  name,
  symbol,
  decimals,
    specification
});

export const delToken = (contract: string) => ({ type: DEL_TOKEN, contract });

export const addTrustedSc = (
  contract: string,
  name: string,
  confirm: boolean,
  password: boolean,
  method?: string,
  paramsHash?: string,
) => ({
  type: ADD_TRUSTED_SC,
  contract,
  name,
  confirm,
  password,
  method,
  paramsHash,
});

export const delTrustedSc = (name: string) => ({ type: DEL_TRUSTED_SC, name });

export function compareSettings(a: SettingsState | null, b: SettingsState | null): boolean {
  if (a === b) {
    return true;
  } else if (a == null || b == null) {
    return false;
  } else {
    return a.net === b.net && a.ssl === b.ssl && a.address === b.address;
  }
}
