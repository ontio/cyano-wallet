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
import { getWallet } from '../../api/authApi';
import { CLEAR_IDENTITY, CLEAR_WALLET, SET_WALLET, WalletState } from '../../redux/wallet';

const defaultState: WalletState = { wallet: null };
export const walletReducer: Reducer<WalletState> = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_IDENTITY:
      
      let walletEncoded = state.wallet!;
      const wallet = getWallet(walletEncoded);
      wallet.identities = [];
      wallet.setDefaultIdentity('');

      walletEncoded = wallet.toJson();
      return { ...state, wallet: walletEncoded };
    case CLEAR_WALLET:
      return { ...state, wallet: null };
    case SET_WALLET:
      return { ...state, wallet: action.wallet };
    default:
      return state;
  }
};
