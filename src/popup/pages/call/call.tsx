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
import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { ScCallRequest } from '../../../redux/transactionRequests';
import { dummy, reduxConnect, withProps } from '../../compose';
import { Actions } from '../../redux';
import { CallView, InitialValues, Props } from './callView';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      resolveRequest: Actions.transactionRequests.resolveRequest,
      updateRequest: Actions.transactionRequests.updateRequest,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(dummy, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleCancel: async () => {
          props.history.goBack();

          const requestId: string = get(props.location, 'state.requestId');
          await actions.resolveRequest(requestId, 'CANCELED');
        },
        handleConfirm: async (values: object) => {
          const requestId: string = get(props.location, 'state.requestId');

          const contract: string = get(values, 'contract');
          const method: string = get(values, 'method');
          const gasPrice = Number(get(values, 'gasPrice', '0'));
          const gasLimit = Number(get(values, 'gasLimit', '0'));

          // todo: no type check ScCallRequest
          await actions.updateRequest(requestId, {
            contract,
            gasLimit,
            gasPrice,
            method,
          } as Partial<ScCallRequest>);

          props.history.push('/confirm', { requestId, redirectSucess: '/dashboard', redirectFail: '/sendFailed' });
        },
        initialValues: {
          contract: get(props.location, 'state.contract', ''),
          gasLimit: String(get(props.location, 'state.gasLimit', 0)),
          gasPrice: String(get(props.location, 'state.gasPrice', 0)),
          method: get(props.location, 'state.method', ''),
        } as InitialValues,
        locked: get(props.location, 'state.locked', false),
      },
      (injectedProps) => <Component {...injectedProps} />,
    ),
  );

export const Call = enhancer(CallView);
