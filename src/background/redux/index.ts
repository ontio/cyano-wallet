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
import { alias, wrapStore } from 'react-chrome-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { GlobalStore } from '../../redux/state';
// import { composeWithDevTools } from 'remote-redux-devtools';
import { loaderReducer } from './loaderReducer';
import { passwordReducer } from './passwordReducer';
import { routerReducer } from './routerReducer';
import { runtimeReducer } from './runtimeReducer';
import { settingsReducer } from './settingsReducer';
import { statusReducer } from './statusReducer';
import { transactionRequestsAliases, transactionRequestsReducer } from './transactionRequestsReducer';
import { walletReducer } from './walletReducer';

export const globalReducer = combineReducers({
  loader: loaderReducer,
  password: passwordReducer,
  router: routerReducer,
  runtime: runtimeReducer,
  settings: settingsReducer,
  status: statusReducer,
  transactionRequests: transactionRequestsReducer,
  wallet: walletReducer,
});

export const aliases = {
  ...transactionRequestsAliases
};

let store: GlobalStore;

export function initStore(): GlobalStore {
  // store = createStore(globalReducer, composeWithDevTools(applyMiddleware(alias(aliases), thunk)));
  store = createStore(globalReducer, applyMiddleware(alias(aliases), thunk));
  wrapStore(store, { portName: 'ONT_EXTENSION' });

  return store;
}

export function getStore() {
  return store;
}
