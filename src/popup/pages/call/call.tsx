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
      contract: get(props.location, 'state.contract', undefined),
      method: get(props.location, 'state.method', undefined),
    };

    const locked: boolean = get(props.location, 'state.locked', false);
    const requestId: string | undefined = get(props.location, 'state.requestId', undefined);

    return withProps(
      {
        handleCancel: async () => {
          props.history.goBack();

          if (requestId !== undefined) {
            await actions.resolveRequest(requestId, 'CANCELED');
          }
        },
        handleConfirm: async (values: object) => {
          const contract = get(values, 'contract', '');
          const method = get(values, 'method', '');
          
          const wallet = getWallet(reduxProps.walletEncoded!);

          if (isLedgerKey(wallet)) {
            // tslint:disable-next-line:no-console
            console.error('Unsupported.')
            // props.history.push('/ledger/sendConfirm', { recipient, asset, amount, requestId });
          } else if (isTrezorKey(wallet)) {
            // tslint:disable-next-line:no-console
            console.error('Unsupported.')
            // props.history.push('/trezor/sendConfirm', { recipient, asset, amount, requestId });
          } else {
            props.history.push('/callConfirm', { contract, method, requestId });
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
