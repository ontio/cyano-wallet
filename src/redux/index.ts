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
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { authReducer, AuthState } from "./auth/authReducer";
import { loaderReducer, LoaderState } from "./loader/loaderReducer";
import { settingsReducer, SettingsState } from "./settings/settingsReducer";
import { statusReducer } from "./status/statusReducer";
import { StatusState } from "./status/statusActions";
import { runtimeReducer, RuntimeState } from "./runtime";

export const globalReducer = combineReducers({
  auth: authReducer,
  loader: loaderReducer,
  settings: settingsReducer,
  status: statusReducer,
  runtime: runtimeReducer
});

export interface GlobalState {
  auth: AuthState;
  loader: LoaderState;
  settings: SettingsState;
  status: StatusState;
  runtime: RuntimeState;
}

export const reduxStore = createStore(globalReducer, composeWithDevTools(applyMiddleware(thunk)));

export type GlobalStore = Store<GlobalState>;

export function getStore() {
  return reduxStore;
}
