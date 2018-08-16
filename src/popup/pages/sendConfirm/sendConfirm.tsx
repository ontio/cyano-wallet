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
import { AssetType } from '../../../redux/runtime';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { Props, SendConfirmView } from './sendConfirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  transaction: state.transaction
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
  finishLoading: Actions.loader.finishLoading,
  startLoading: Actions.loader.startLoading,
  transfer: Actions.runtime.transfer
}, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async (values: object, formApi: FormApi) => {
        const recipient: string = get(props.location, 'state.recipient', '');
        const asset: AssetType = get(props.location, 'state.asset', '');
        const amount: string = get(props.location, 'state.amount', '');
        const requestId: string | undefined = get(props.location, 'state.requestId', undefined);

        const password: string = get(values, 'password', '');

        await actions.startLoading();
        await actions.transfer(password, recipient, asset, amount, requestId);
        await actions.finishLoading();
  
        const transactionResult = getReduxProps().transaction;

        if (transactionResult.error === 'WRONG_PASSWORD') {
          formApi.change('password', '');
          
          return {
            password: ''
          };
        } else {
          if (requestId !== undefined) {
            // returns to dashboard if external request
            props.history.push('/dashboard');
          } else {
            if (transactionResult.result) {
              props.history.push('/sendComplete', { recipient, asset, amount });
            } else if (transactionResult.error === 'TIMEOUT') {
              props.history.push('/sendFailed', { recipient, asset, amount });
            }            
          }
        } 

        return {};
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} />
    ))
  ))
)

export const SendConfirm = enhancer(SendConfirmView);
