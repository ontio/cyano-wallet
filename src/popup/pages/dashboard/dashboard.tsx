
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
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { v4 as uuid } from 'uuid';
import { getAddress } from '../../../api/accountApi';
import { TransferRequest, WithdrawOngRequest } from '../../../redux/transactionRequests';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { convertAmountToStr } from '../../utils/number';
import { DashboardView, Props } from './dashboardView';

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  transfers: state.runtime.transfers,
  unboundAmount: state.runtime.unboundAmount,
  walletEncoded: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
  addRequest: Actions.transactionRequests.addRequest
}, dispatch);


const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => (
    withProps({
      handleReceive: () => {
        props.history.push('/receive');
      },
      handleSend: async () => {
        const requestId = uuid();
        // todo: no type check TransferRequest
        await actions.addRequest({
          amount: 0,
          asset: 'ONT',
          id: requestId,
          recipient: '',
          type: 'transfer',
        } as TransferRequest);

        props.history.push('/send', { requestId });
      },
      handleTransfers: () => {
        props.history.push('/transfers');
      },
      handleWithdraw: async () => {
        if (reduxProps.unboundAmount > 0) {

          const requestId = uuid();
          // todo: no type check TransferRequest
          await actions.addRequest({
            amount: reduxProps.unboundAmount,
            id: requestId,
            type: 'withdraw_ong',
          } as WithdrawOngRequest);

          props.history.push('/confirm', { requestId, redirectSucess: '/sendComplete', redirectFail: '/sendFailed' });
        }
      },
      ongAmount: convertAmountToStr(reduxProps.ongAmount, 'ONG'),
      ontAmount: convertAmountToStr(reduxProps.ontAmount, 'ONT'),
      ownAddress: getAddress(reduxProps.walletEncoded!),
      transfers: reduxProps.transfers.slice(0, 2),
      unboundAmount: convertAmountToStr(reduxProps.unboundAmount, 'ONG'),
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ))
  ))
);

export const Dashboard = enhancer(DashboardView);
