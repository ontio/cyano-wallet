import { combineReducers } from 'redux';
import { authReducer, AuthState } from '../auth/authReducer';
import { loaderReducer, LoaderState } from '../loader/loaderReducer';
import { walletReducer, WalletState } from '../wallet/walletReducer';

export const globalReducer = combineReducers({
    auth: authReducer,
    loader: loaderReducer,
    wallet: walletReducer
});

export interface GlobalState {
    auth: AuthState;
    loader: LoaderState;
    wallet: WalletState;
};
