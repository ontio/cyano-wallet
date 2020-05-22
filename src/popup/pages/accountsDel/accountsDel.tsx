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
import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { accountDelete } from 'src/api/accountApi';
import { getBackgroundManager } from 'src/popup/backgroundManager';
import { GlobalState } from 'src/redux/state';
import { reduxConnect, withProps } from '../../compose';
import { Actions } from '../../redux';
import { AccountsDelView, Props } from './accountsDelView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      delToken: Actions.settings.delToken,
      finishLoading: Actions.loader.finishLoading,
      setWallet: Actions.wallet.setWallet,
      startLoading: Actions.loader.startLoading,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const account: string = get(props.location, 'state.account');

    return withProps(
      {
        account,
        handleCancel: async () => {
          props.history.goBack();
        },
        handleConfirm: async () => {
          await actions.startLoading();

          if (reduxProps.wallet != null) {
            const { wallet } = accountDelete(account, reduxProps.wallet);
            await actions.setWallet(wallet);

            await getBackgroundManager().refreshBalance();
          }
          await actions.finishLoading();

          props.history.push('/account/change');
        },
        loading: reduxProps.loading,
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const AccountsDel = enhancer(AccountsDelView);
