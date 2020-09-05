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

import { finishLoading, startLoading } from './loader';
import { clearPassword, setPassword } from './password';
import { setRouterState } from './router';
import { setBalance, setTransfers } from './runtime';
import { addToken, addTrustedSc, delToken, delTrustedSc, setSettings } from './settings';
import { changeNetworkState } from './status';
import { addRequest, resolveRequest, submitRequest, updateRequest } from './transactionRequests';
import { clearIdentity, clearWallet, setWallet } from './wallet';

export default {
  loader: {
    finishLoading,
    startLoading,
  },
  password: {
    clearPassword,
    setPassword,
  },
  router: {
    setRouterState,
  },
  runtime: {
    setBalance,
    setTransfers,
  },
  settings: {
    addToken,
    addTrustedSc,
    delToken,
    delTrustedSc,
    setSettings,
  },
  status: {
    changeNetworkState,
  },
  transactionRequests: {
    addRequest,
    resolveRequest,
    submitRequest,
    updateRequest,
  },
  wallet: {
    clearIdentity,
    clearWallet,
    setWallet
  },
};
