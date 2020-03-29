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

export type AssetType = 'ONT' | 'ONG' | string;

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
}

export interface RuntimeState {
  ongAmount: number;
  ontAmount: number;
  nepAmount: number;

  unboundAmount: number;
  transfers: Transfer[];

  tokenAmounts: TokenAmountState[];
};

export const SET_BALANCE = 'SET_BALANCE';
export const SET_TRANSFERS = 'SET_TRANSFERS';

export const setBalance = (ongAmount: number, ontAmount: number, unboundAmount: number, nepAmount: number, tokenAmounts: TokenAmountState[]) => ({ type: SET_BALANCE, ongAmount, ontAmount, unboundAmount, nepAmount, tokenAmounts });

export const setTransfers = (transfers: Transfer[]) => ({ type: SET_TRANSFERS, transfers });
