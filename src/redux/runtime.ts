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

export type AssetType = 'ONT' | 'ONG';

export interface Transfer {
  amount: string;
  asset: AssetType;
  from: string;
  to: string;
  time: number;
}

export interface RuntimeState {
  ongAmount: number;
  ontAmount: number;

  unboundAmount: number;
  transfers: Transfer[];
};

export const SET_BALANCE = 'SET_BALANCE';
export const SET_TRANSFERS = 'SET_TRANSFERS';
export const TRANSFER = "TRANSFER";
export const WITHDRAW_ONG = "WITHDRAW_ONG";

export const REGISTER_ONT_ID = "REGISTER_ONT_ID";

export const CHECK_ONT_ID = "CHECK_ONT_ID";

export const setBalance = (ongAmount: number, ontAmount: number, unboundAmount: number) => ({ type: SET_BALANCE, ongAmount, ontAmount, unboundAmount });

export const setTransfers = (transfers: Transfer[]) => ({ type: SET_TRANSFERS, transfers });

export const transfer = (password: string, recipient: string, asset: AssetType, amount: string, requestId?: string) => ({ type: TRANSFER, password, recipient, asset, amount, requestId });

export const registerOntId = (identity: string, password: string, accountPassword: string) => ({ type: REGISTER_ONT_ID, identity, password, accountPassword });

export const checkOntId = (identity: string, password: string) => ({ type: CHECK_ONT_ID, identity, password });

export const withdrawOng = (password: string, amount: string) => ({ type: WITHDRAW_ONG, password, amount });
