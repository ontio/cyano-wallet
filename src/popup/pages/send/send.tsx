
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
import { get } from 'lodash';
import * as React from 'react';
import { FormRenderProps } from 'react-final-form';
import { RouterProps } from 'react-router';
import { getWallet } from '../../../api/authApi';
import { isLedgerKey } from '../../../api/ledgerApi';
import { isTrezorKey } from '../../../api/trezorApi';
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { Props, SendView } from './sendView';

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  walletEncoded: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, dummy, (reduxProps) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleConfirm: async (values: object) => {
        const recipient = get(values, 'recipient', '');
        const asset = get(values, 'asset', '');
        const amount = get(values, 'amount', '');

        const wallet = getWallet(reduxProps.walletEncoded!);
        
        if (isLedgerKey(wallet)) {
          props.history.push('/ledger/sendConfirm', { recipient, asset, amount });
        } else if (isTrezorKey(wallet)) {
          props.history.push('/trezor/sendConfirm', { recipient, asset, amount });
        } else {
          props.history.push('/sendConfirm', { recipient, asset, amount });
        }
      },
      handleMax: (formProps: FormRenderProps) => {
        const asset: string | undefined = get(formProps.values, 'asset');

        if (asset === 'ONT') {
          formProps.form.change('amount', reduxProps.ontAmount);
        } else if (asset === 'ONG') {
          formProps.form.change('amount', reduxProps.ongAmount);
        }
        return true;
      }
    }, (injectedProps) => (
      <Component {...injectedProps} ontAmount={reduxProps.ontAmount} ongAmount={reduxProps.ongAmount} />
    ))
  ))
)

export const Send = enhancer(SendView);
