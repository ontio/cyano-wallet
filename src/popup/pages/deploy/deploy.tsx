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
import { ScDeployRequest } from '../../../redux/transactionRequests';
import { dummy, reduxConnect, withProps } from '../../compose';
import { Actions } from '../../redux';
import { DeployView, InitialValues, Props } from './deployView';

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

          const author: string = get(values, 'author');
          const description: string = get(values, 'description');
          const gasPrice = Number(get(values, 'gasPrice', '0'));
          const gasLimit = Number(get(values, 'gasLimit', '0'));
          const email: string = get(values, 'email');
          const needStorage: boolean = get(values, 'needStorage');
          const version: string = get(values, 'version');

          // todo: no type check ScDeployRequest
          await actions.updateRequest(requestId, {
            author,
            description,
            email,
            gasLimit,
            gasPrice,
            name,
            needStorage,
            version
          } as Partial<ScDeployRequest>);

          props.history.push('/confirm', { requestId, redirectSucess: '/dashboard', redirectFail: '/dashboard' });
        },
        initialValues: {
          author: get(props.location, 'state.author', ''),
          description: get(props.location, 'state.description', ''),
          email: get(props.location, 'state.email', ''),
          gasLimit: String(get(props.location, 'state.gasLimit', 0)),
          gasPrice: String(get(props.location, 'state.gasPrice', 0)),
          name: get(props.location, 'state.name', ''),
          needStorage: get(props.location, 'state.needStorage', false),
          version: get(props.location, 'state.version', '')
        } as InitialValues,
        locked: get(props.location, 'state.locked', false),
      },
      (injectedProps) => <Component {...injectedProps} />,
    ),
  );

export const Deploy = enhancer(DeployView);
