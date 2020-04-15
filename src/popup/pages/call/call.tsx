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
import { GlobalState } from '../../../redux/state';
import { ScCallRequest } from '../../../redux/transactionRequests';
import { reduxConnect, withProps } from '../../compose';
import { Actions } from '../../redux';
import { CallView, InitialValues, Props } from './callView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  password: state.password.password,
  requests: state.transactionRequests.requests,
  trustedScs: state.settings.trustedScs,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addTrustedSc: Actions.settings.addTrustedSc,
      finishLoading: Actions.loader.finishLoading,
      resolveRequest: Actions.transactionRequests.resolveRequest,
      startLoading: Actions.loader.startLoading,
      submitRequest: Actions.transactionRequests.submitRequest,
      updateRequest: Actions.transactionRequests.updateRequest,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) =>
    withProps(
      {
        allowWhitelist: !get(reduxProps.requests.find((r) => r.id === get(props.location, 'state.requestId'))!, 'requireIdentity', false),
        handleCancel: async () => {
          props.history.goBack();

          const requestId: string = get(props.location, 'state.requestId');
          await actions.resolveRequest(requestId, 'CANCELED');
        },
        handleConfirm: async (values: object) => {
          const requestId: string = get(props.location, 'state.requestId');

          const contract: string = get(values, 'contract');
          const method: string = get(values, 'method');
          const paramsHash: string = get(values, 'paramsHash');
          const gasPrice = Number(get(values, 'gasPrice', '0'));
          const gasLimit = Number(get(values, 'gasLimit', '0'));
          const whitelist: boolean = get(values, 'whitelist');

          if (whitelist) {
            const name = `${contract}_${method}_${paramsHash}`;
            await actions.addTrustedSc(contract, name, false, false, method, paramsHash);
          }

          // todo: no type check ScCallRequest
          await actions.updateRequest(requestId, {
            contract,
            gasLimit,
            gasPrice,
            method,
          } as Partial<ScCallRequest>);

          const requireIdentity = get(reduxProps.requests.find((r) => r.id === get(props.location, 'state.requestId'))!, 'requireIdentity', false)

          if (reduxProps.password !== undefined && requireIdentity !== true) {
            // check if we already have password stored
            // whitelisting is not supported for account+identity sign

            const trustedSc = reduxProps.trustedScs.find(
              (t) =>
                t.contract === contract &&
                (t.method === undefined || t.method === method) &&
                (t.paramsHash === undefined || t.paramsHash === paramsHash),
            );
            if (trustedSc !== undefined && trustedSc.password === false) {
              // check if password is not required

              await actions.startLoading();
              await actions.submitRequest(requestId, reduxProps.password);
              await actions.finishLoading();

              const requests = getReduxProps().requests;
              const request = requests.find((r) => r.id === requestId);

              if (request === undefined) {
                throw new Error('Request not found');
              }

              if (request.error !== undefined) {
                props.history.push('/sendFailed', { ...props.location.state, request });
              } else {
                props.history.push('/dashboard', { ...props.location.state, request });
              }

              return;
            }
          }

          props.history.push('/confirm', { requestId, redirectSucess: '/dashboard', redirectFail: '/sendFailed' });
        },
        initialValues: {
          contract: get(props.location, 'state.contract', ''),
          gasLimit: String(get(props.location, 'state.gasLimit', 0)),
          gasPrice: String(get(props.location, 'state.gasPrice', 0)),
          method: get(props.location, 'state.method', ''),
          paramsHash: get(props.location, 'state.paramsHash', undefined),
          paramsJson: JSON.stringify(get(props.location, 'state.parameters', undefined), null, 1),
        } as InitialValues,
        isFsCall: get(props.location, 'state.isFsCall', false),
        locked: get(props.location, 'state.locked', false),
      },
      (injectedProps) => <Component {...injectedProps} loading={reduxProps.loading} />,
    ),
  );

export const Call = enhancer(CallView);
