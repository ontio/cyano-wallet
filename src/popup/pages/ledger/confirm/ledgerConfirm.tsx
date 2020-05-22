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
import { isScCallRequest } from 'src/redux/transactionRequests';
import { reduxConnect, withProps } from '../../../compose';
import { Actions, GlobalState } from '../../../redux';
import { LedgerConfirmView, Props } from './ledgerConfirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  requests: state.transactionRequests.requests,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
  finishLoading: Actions.loader.finishLoading,
  startLoading: Actions.loader.startLoading,
  submitRequest: Actions.transactionRequests.submitRequest,
}, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async () => {
        const requestId: string = get(props.location, 'state.requestId');
        const redirectSucess: string = get(props.location, 'state.redirectSucess');
        const redirectFail: string = get(props.location, 'state.redirectFail');
        const identityConfirm: boolean = get(props.location, 'state.identityConfirm', false);

        
        await actions.startLoading();
        await actions.submitRequest(requestId, '');
        await actions.finishLoading();

        const requests = getReduxProps().requests;
        const request = requests.find((r) => r.id === requestId);

        if (request === undefined) {
          throw new Error('Request not found');
        }

        if (request.error !== undefined) {
          props.history.push(redirectFail, { requestId });
        } else {
          if (isScCallRequest(request) && request.requireIdentity && !identityConfirm) {
            // if this is SC CALL request
            // and it requires identity Confirm
            // and this is account confirm
            // go to identity confirm instead of success
            props.history.push('/confirm', { ...props.location.state, identityConfirm: true });
          } else {
            props.history.push(redirectSucess, { ...props.location.state, request });
          }
        }
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} identityConfirm={get(props.location, 'state.identityConfirm', false)} />
    ))
  ))
)

export const LedgerConfirm = enhancer(LedgerConfirmView);
