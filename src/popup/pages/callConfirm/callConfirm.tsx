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

import { Parameter } from 'ontology-dapi';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { CallConfirmView, Props } from './callConfirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  requests: state.transactionRequests.requests
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
  finishLoading: Actions.loader.finishLoading,
  scCall: Actions.smartContract.scCall,
  startLoading: Actions.loader.startLoading
}, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async (values: object, formApi: FormApi) => {
        // const account: string = get(props.location, 'state.account', '');
        // const addresses: string[] = get(props.location, 'state.addresses', '');
        const contract: string = get(props.location, 'state.contract', '');
        // const gasLimit: number = get(props.location, 'state.gasLimit', 30000);
        // const gasPrice: number = get(props.location, 'state.gasPrice', 500);
        const method: string = get(props.location, 'state.method', '');
        const parameters: Parameter[] = get(props.location, 'state.parameters', '');
        const requestId: string = get(props.location, 'state.requestId', undefined);

        // custom account, addresses and gas specifics are not supported yet

        const password: string = get(values, 'password', '');

        await actions.startLoading();
        await actions.scCall(password, contract, method, parameters, requestId);
        await actions.finishLoading();

        const requests = getReduxProps().requests;
        const request = requests.find(r => r.id === requestId);

        if (request === undefined) {
          throw new Error('Request not found');
        }
  
        if (request.error === 'WRONG_PASSWORD') {
          formApi.change('password', '');
          
          return {
            password: ''
          };
        } else {
          props.history.push('/dashboard');
        } 

        return {};
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} />
    ))
  ))
)

export const CallConfirm = enhancer(CallConfirmView);
