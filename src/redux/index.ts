import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { walletReducer, WalletState } from "./wallet";
import { loaderReducer, LoaderState } from "./loader/loaderReducer";
import { settingsReducer, SettingsState } from "./settings/settingsReducer";
import { statusReducer } from "./status/statusReducer";
import { StatusState } from "./status/statusActions";
import { runtimeReducer, RuntimeState } from "./runtime";

export const globalReducer = combineReducers({
  wallet: walletReducer,
  loader: loaderReducer,
  settings: settingsReducer,
  status: statusReducer,
  runtime: runtimeReducer
});

export interface GlobalState {
  wallet: WalletState;
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
