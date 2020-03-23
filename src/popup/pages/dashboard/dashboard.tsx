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
import BigNumber from 'bignumber.js';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { OEP4TokenAmount } from 'src/api/tokenApi';
import { TokenAmountState } from 'src/redux/runtime';
import { TokenState } from 'src/redux/settings';
import { v4 as uuid } from 'uuid';
import { getAddress } from '../../../api/accountApi';
import { SwapRequest, TransferRequest, WithdrawOngRequest } from '../../../redux/transactionRequests';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { convertAmountToBN, convertAmountToStr, decodeAmount } from '../../utils/number';
import { DashboardView, Props } from './dashboardView';

const mapStateToProps = (state: GlobalState) => ({
  nepAmount: state.runtime.nepAmount,
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  tokenAmounts: state.runtime.tokenAmounts,
  tokens: state.settings.tokens,
  transfers: state.runtime.transfers,
  unboundAmount: state.runtime.unboundAmount,
  walletEncoded: state.wallet.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addRequest: Actions.transactionRequests.addRequest,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
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
        handleSwap: async () => {
          if (convertAmountToBN(reduxProps.nepAmount, 'NEP').gte(new BigNumber('1.0'))) {
            const requestId = uuid();
            // todo: no type check SwapRequest
            await actions.addRequest({
              amount: reduxProps.nepAmount,
              id: requestId,
              type: 'swap',
            } as SwapRequest);

            props.history.push('/swap', { requestId });
          }
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
        nepAmount: convertAmountToStr(reduxProps.nepAmount, 'NEP'),
        ongAmount: convertAmountToStr(reduxProps.ongAmount, 'ONG'),
        ontAmount: convertAmountToStr(reduxProps.ontAmount, 'ONT'),
        ownAddress: getAddress(reduxProps.walletEncoded!),
        tokens: prepareTokenAmounts(reduxProps.tokens, reduxProps.tokenAmounts),
        unboundAmount: convertAmountToStr(reduxProps.unboundAmount, 'ONG'),
      },
      (injectedProps) => <Component {...injectedProps} />,
    ),
  );

function prepareTokenAmounts(tokens: TokenState[] = [], items: TokenAmountState[] = []): OEP4TokenAmount[] {
  return items.map((item) => {
    const contract = item.contract;
    const token = tokens.find((t) => t.contract === contract)!;

    const amount = decodeAmount(item.amount, token.decimals);

    return {
      amount,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
      vmType: token.vmType,
    };
  });
}

export const Dashboard = enhancer(DashboardView);
