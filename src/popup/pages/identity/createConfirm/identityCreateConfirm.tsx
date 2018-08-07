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
import { FormApi } from 'final-form';
import { get } from 'lodash';

import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { getWallet } from '../../../../api/authApi';
import { identitySignUp } from '../../../../api/identityApi';
import { reduxConnect, withProps } from '../../../compose';
import { Actions, GlobalState } from '../../../redux';
import { IdentityCreateConfirmView, Props } from './identityCreateConfirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  transaction: state.transaction,
  walletEncoded: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
  finishLoading: Actions.loader.finishLoading,
  registerOntId: Actions.runtime.registerOntId,
  setWallet: Actions.wallet.setWallet,
  startLoading: Actions.loader.startLoading
}, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async (values: object, formApi: FormApi) => {
        const wallet = getWallet(reduxProps.walletEncoded!);

        const password: string = get(props.location, 'state.password', '');

        const accountPassword: string = get(values, 'password', '');

        await actions.startLoading();
        const { encryptedWif, mnemonics, wif, identity } = identitySignUp(password, wallet.scrypt);
        await actions.registerOntId(identity.toJson(), password, accountPassword);

        wallet.addIdentity(identity);
        wallet.setDefaultIdentity(identity.ontid);

        await actions.setWallet(wallet.toJson());
        await actions.finishLoading();

        const transactionResult = getReduxProps().transaction;
        
        if (transactionResult.result) {
          props.history.push('/identity/new', { encryptedWif, mnemonics, wif });
        } else if (transactionResult.error === 'WRONG_PASSWORD') {
          formApi.change('password', '');
          
          return {
            password: ''
          };
        } else {
          props.history.push('/identity/checkFailed');
        } 

        return {};
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} />
    ))
  ))
)

export const IdentityCreateConfirm = enhancer(IdentityCreateConfirmView);
