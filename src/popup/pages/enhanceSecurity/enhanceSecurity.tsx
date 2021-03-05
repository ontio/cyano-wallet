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
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { encodeWallet, getWallet } from 'src/api/authApi';
import { EnhanceSecurityParams, getEnhanceSecurityParams, getUnsafeAccounts } from 'src/api/securityApi';
import { getBackgroundManager } from 'src/popup/backgroundManager'
import { v4 as uuid } from 'uuid';
import { EnhanceSecurityRequest } from '../../../redux/transactionRequests'
import { lifecycle, reduxConnect, withProps, withState } from "../../compose";
import { Actions, GlobalState } from '../../redux';
import { EnhanceSecurityView, Props } from './enhanceSecurityView';

interface State {
  enhanceSecurityParams: EnhanceSecurityParams | null;
  timer: number;
  unsafeAccounts: string[];
}

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  net: state.settings.net,
  walletEncoded: state.wallet.wallet
});

const defaultState = {
  enhanceSecurityParams: null,
  timer: -1,
  unsafeAccounts: [],
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addRequest: Actions.transactionRequests.addRequest,
      finishLoading: Actions.loader.finishLoading,
      setWallet: Actions.wallet.setWallet,
      startLoading: Actions.loader.startLoading
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const wallet = getWallet(reduxProps.walletEncoded!);
    const accounts = wallet.accounts.map(account => account.address.toBase58());

    return withState<State>(defaultState, (state, setState, getState) =>
      lifecycle({
        componentDidMount: () => {
          async function checkAccountsSecurity() {
            const unsafeAccounts = await getUnsafeAccounts(accounts, reduxProps.net);
            if (unsafeAccounts.length) {
              const enhanceSecurityParams = await getEnhanceSecurityParams(reduxProps.net);
              if (enhanceSecurityParams) {
                setState({ ...getState(), unsafeAccounts, enhanceSecurityParams });
              }
            } else {
              props.history.push('/dashboard');
            }
          }
            const timer = window.setInterval(checkAccountsSecurity, 5000);
            setState({ ...getState(), timer, });
            checkAccountsSecurity();
        },
        componentWillUnmount: () => {
          window.clearInterval(getState().timer);
        },
      }, () =>
        withProps({
          handleBack() {
            props.history.goBack();
          },
          async handleEnhanceSecurity(account: string) {
            if (state.enhanceSecurityParams) {
              wallet.setDefaultAccount(account);
              const encodedWallet = encodeWallet(wallet);

              await actions.startLoading();
              await actions.setWallet(encodedWallet);

              await getBackgroundManager().refreshBalance();

              await actions.finishLoading();

              const requestId = uuid();
              await actions.addRequest({
                contract: state.enhanceSecurityParams.contract,
                id: requestId,
                method: state.enhanceSecurityParams.method,
                net: reduxProps.net,
                payer: state.enhanceSecurityParams.payer,
                type: 'enhance_security',
              } as EnhanceSecurityRequest);

              props.history.push('/confirm', { requestId, redirectSucess: '/enhanceSecurity', redirectFail: '/sendFailed' });
            }
          },
          loading: reduxProps.loading,
          selectedAccount: wallet.defaultAccountAddress,
          unsafeAccounts: state.unsafeAccounts,
        }, (injectedProps) => <Component {...injectedProps} />)
      )
    )
  });

export const EnhanceSecurity = enhancer(EnhanceSecurityView);
