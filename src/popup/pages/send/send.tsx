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
import { BigNumber } from 'bignumber.js';
import { get } from 'lodash';
import * as React from 'react';
import { FormRenderProps } from 'react-final-form';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { AssetType } from '../../../redux/runtime';
import { TransferRequest } from '../../../redux/transactionRequests';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { convertAmountFromStr, convertAmountToBN, convertAmountToStr, decodeAmount } from '../../utils/number';
import { InitialValues, Props, SendView } from './sendView';

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  tokenAmounts: state.runtime.tokenAmounts,
  tokens: state.settings.tokens
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      resolveRequest: Actions.transactionRequests.resolveRequest,
      updateRequest: Actions.transactionRequests.updateRequest,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const initAsset: AssetType = get(props.location, 'state.asset', 'ONT');
    const initAmountNumber: number | undefined = get(props.location, 'state.amount', undefined);
    const initRecipient: string | undefined = get(props.location, 'state.recipient', undefined);

    const initialValues: InitialValues = {
      amount: convertAmountToStr(initAmountNumber, initAsset),
      asset: initAsset,
      recipient: initRecipient,
    };

    const tokenOptions = reduxProps.tokens.map(token => ({ text: token.symbol, value: token.symbol }));

    const nativeOptions = [
      {
        text: 'ONT',
        value: 'ONT',
      },
      {
        text: 'ONG',
        value: 'ONG',
      },
    ];

    return withProps(
      {
        assetOptions: [...nativeOptions, ...tokenOptions],
        handleCancel: async () => {
          props.history.goBack();

          const requestId: string = get(props.location, 'state.requestId');
          await actions.resolveRequest(requestId, 'CANCELED');
        },
        handleConfirm: async (values: object) => {
          const requestId: string = get(props.location, 'state.requestId');

          const recipient: string = get(values, 'recipient', '');
          const asset: AssetType = get(values, 'asset', '');
          const amountStr: string = get(values, 'amount', '0');

          const amount = convertAmountFromStr(amountStr, asset);

          // todo: no type check TransferRequest
          await actions.updateRequest(requestId, {
            amount,
            asset,
            recipient,
          } as Partial<TransferRequest>);

          props.history.push('/confirm', { requestId, redirectSucess: '/sendComplete', redirectFail: '/sendFailed' });
        },
        handleMax: (formProps: FormRenderProps) => {
          const asset: string | undefined = get(formProps.values, 'asset');

          if (asset === 'ONT') {
            formProps.form.change('amount', String(reduxProps.ontAmount));
          } else if (asset === 'ONG') {
            let amountBN = convertAmountToBN(reduxProps.ongAmount, 'ONG');
            amountBN = amountBN.minus(new BigNumber('0.01'));
            amountBN = amountBN.isNegative() ? new BigNumber(0) : amountBN;

            formProps.form.change('amount', amountBN.toString());
          } else {
              const token = reduxProps.tokens.find(item => item.symbol === asset);
              if (token) {
                  const tokenAmount = reduxProps.tokenAmounts.find(item => item.contract === token.contract)!
                  const amount = decodeAmount(tokenAmount.amount, token.decimals);
                  formProps.form.change('amount', amount )
              }
          }
          return true;
        },
        initialValues,
        locked: get(props.location, 'state.locked', false),
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const Send = enhancer(SendView);
