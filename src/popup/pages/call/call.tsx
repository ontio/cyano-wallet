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
import { Parameter } from 'ontology-dapi';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { getWallet } from '../../../api/authApi';
import { isLedgerKey } from '../../../api/ledgerApi';
import { isTrezorKey } from '../../../api/trezorApi';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { CallView, InitialValues, Props } from './callView';

const mapStateToProps = (state: GlobalState) => ({
  walletEncoded: state.wallet.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
  resolveRequest: Actions.transactionRequests.resolveRequest
}, dispatch);


const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const initialValues: InitialValues = {
      contract: get(props.location, 'state.contract', ''),
      gasLimit: String(get(props.location, 'state.gasLimit', 0)),
      gasPrice: String(get(props.location, 'state.gasPrice', 0)),
      method: get(props.location, 'state.method', '')
    };

    const locked: boolean = get(props.location, 'state.locked', false);
    const requestId: string = get(props.location, 'state.requestId');
    const parameters: Parameter[] = get(props.location, 'state.parameters', '');
    const addresses: string[] = get(props.location, 'state.addresses', []);

    return withProps(
      {
        handleCancel: async () => {
          props.history.goBack();

          if (requestId !== undefined) {
            await actions.resolveRequest(requestId, 'CANCELED');
          }
        },
        handleConfirm: async (values: object) => {
          const contract: string = get(values, 'contract', '');
          const method: string = get(values, 'method', '');
          const gasPrice = Number(get(values, 'gasPrice', '0'));
          const gasLimit = Number(get(values, 'gasLimit', '0'));
          
          const wallet = getWallet(reduxProps.walletEncoded!);

          if (isLedgerKey(wallet)) {
            throw new Error('UNSUPPORTED');
            // props.history.push('/ledger/sendConfirm', { recipient, asset, amount, requestId });
          } else if (isTrezorKey(wallet)) {
            throw new Error('UNSUPPORTED');
            // props.history.push('/trezor/sendConfirm', { recipient, asset, amount, requestId });
          } else {
            props.history.push('/callConfirm', { contract, method, requestId, parameters, gasPrice, gasLimit, addresses });
          }
        },
        initialValues,
        locked
      },
      (injectedProps) => (
        <Component {...injectedProps} />
      ),
    );
  });

export const Call = enhancer(CallView);
