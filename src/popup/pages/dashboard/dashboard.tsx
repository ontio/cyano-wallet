
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
import { getAddress } from '../../../api/accountApi';
import { getWallet } from '../../../api/authApi';
import { isLedgerKey } from '../../../api/ledgerApi';
import { isTrezorKey } from '../../../api/trezorApi';
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { DashboardView, Props } from './dashboardView';

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  transfers: state.runtime.transfers,
  unboundAmount: state.runtime.unboundAmount,
  walletEncoded: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, dummy, (reduxProps) => (
    withProps({
      handleReceive: () => {
        props.history.push('/receive');
      },
      handleSend: () => {
        props.history.push('/send');
      },
      handleTransfers: () => {
        props.history.push('/transfers');
      },
      handleWithdraw: () => {
        if (reduxProps.unboundAmount > 0) {
          const wallet = getWallet(reduxProps.walletEncoded!);

          if (isLedgerKey(wallet)) {
            props.history.push('/ledger/withdrawConfirm');
          } else if (isTrezorKey(wallet)) {
            props.history.push('/trezor/withdrawConfirm');
          } else {
            props.history.push('/withdrawConfirm');
          }
        }
      },
      ownAddress: getAddress(reduxProps.walletEncoded!),
      transfers: reduxProps.transfers.slice(0, 2)
    }, (injectedProps) => (
      <Component {...injectedProps} ontAmount={reduxProps.ontAmount} ongAmount={reduxProps.ongAmount} unboundAmount={reduxProps.unboundAmount} />
    ))
  ))
);

export const Dashboard = enhancer(DashboardView);
