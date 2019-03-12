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
import { timeout, TimeoutError } from 'promise-timeout';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { transfer } from '../../api/walletApi';
import { reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { finishLoading, startLoading } from '../../redux/loader/loaderActions';
import { Props, SendConfirmView } from './sendConfirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.auth.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async (values: object, formApi: FormApi) => {
        const recipient: string = get(props.location, 'state.recipient', '');
        const asset: 'ONYX' | 'OXG' = get(props.location, 'state.asset', '');
        const amount: string = get(props.location, 'state.amount', '');

        const password: string = get(values, 'password', '');

        actions.startLoading();

        try {
          await timeout(transfer(reduxProps.nodeAddress, reduxProps.ssl, reduxProps.wallet, password, recipient, asset, amount), 15000);

          props.history.push('/sendComplete', { recipient, asset, amount });
        } catch (e) {
          if (e instanceof TimeoutError) {
            props.history.push('/sendFailed', { recipient, asset, amount });
          } else {
            formApi.change('password', '');
            
            return {
              password: ''
            };
          }
        } finally {
          actions.finishLoading();
        }

        return {};
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} />
    ))
  ))
)

export const SendConfirm = enhancer(SendConfirmView);
