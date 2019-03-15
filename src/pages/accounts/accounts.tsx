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
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { encodeWallet, getWallet } from 'src/api/authApi';
import { reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { setWallet } from '../../redux/auth/authActions';
import { finishLoading, startLoading } from '../../redux/loader/loaderActions';
import { AccountsView, Props } from './accountsView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
//  transfers: state.runtime.transfers,
  wallet: state.auth.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      accountsFinishLoading: finishLoading,
      accountsSetWallet: setWallet,
      accountsStartLoading: startLoading,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const wallet = getWallet(reduxProps.wallet!);
    const accounts = wallet.accounts.map((account) => account.address.toBase58());

    return withProps(
      {
        accounts,
        handleAccountClick: async (account: string) => {
          wallet.setDefaultAccount(account);
          const encodedWallet = encodeWallet(wallet);

          await actions.accountsStartLoading();
          await actions.accountsSetWallet(encodedWallet);

          // await getBackgroundManager().refreshBalance();

          await actions.accountsFinishLoading();

          props.history.push('/');
        },
        handleAccountDelClick: (account: string) => {
          if (wallet.accounts.length > 1) {
            props.history.push('/account/del', { account });
          }
        },
        handleAdd: () => {
          props.history.push('/account/add');
        },
        handleBack: () => {
          props.history.push('/');
        },
        loading: reduxProps.loading,
        selectedAccount: wallet.defaultAccountAddress,
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const AccountsPage = enhancer(AccountsView);
