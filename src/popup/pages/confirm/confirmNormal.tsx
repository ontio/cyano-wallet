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
import { isScCallRequest } from 'src/redux/transactionRequests';
import { getBackgroundManager } from '../../backgroundManager';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { ConfirmView, Props } from './confirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  requests: state.transactionRequests.requests,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      finishLoading: Actions.loader.finishLoading,
      startLoading: Actions.loader.startLoading,
      submitRequest: Actions.transactionRequests.submitRequest,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) =>
    withProps(
      {
        handleCancel: () => {
          props.history.goBack();
        },
        handleSubmit: async (values: object, formApi: FormApi) => {
          const requestId: string = get(props.location, 'state.requestId');
          const redirectSucess: string = get(props.location, 'state.redirectSucess');
          const redirectFail: string = get(props.location, 'state.redirectFail');
          const identityConfirm: boolean = get(props.location, 'state.identityConfirm', false);
          const password: string = get(values, 'password', '');

          // test if the password is correct
          if (!identityConfirm) {
            // in case of Identity sign, check password for default identity
            const passwordCorrect = await getBackgroundManager().checkAccountPassword(password);
            if (!passwordCorrect) {
              formApi.change('password', '');

              return {
                password: '',
              };
            }
          } else {
            // in case of Account sign, check password for default account
            const passwordCorrect = await getBackgroundManager().checkIdentityPassword(password);
            if (!passwordCorrect) {
              formApi.change('password', '');

              return {
                password: '',
              };
            }
          }

          await actions.startLoading();
          await actions.submitRequest(requestId, password);
          await actions.finishLoading();

          const requests = getReduxProps().requests;
          const request = requests.find((r) => r.id === requestId);

          if (request === undefined) {
            throw new Error('Request not found');
          }

          if (request.error !== undefined) {
            props.history.push(redirectFail, { ...props.location.state, request });
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

          return {};
        },
      },
      (injectedProps) => <Component {...injectedProps} loading={reduxProps.loading} identityConfirm={get(props.location, 'state.identityConfirm', false)} />,
    ),
  );

export const Confirm = enhancer(ConfirmView);
