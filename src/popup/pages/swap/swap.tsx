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
import { get } from 'lodash';
import * as React from 'react';
import { FormRenderProps } from 'react-final-form';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { SwapRequest } from '../../../redux/transactionRequests';
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { convertAmountFromStr, convertAmountToBN, convertAmountToStr } from '../../utils/number';
import { InitialValues, Props, SwapView } from './swapView';

const mapStateToProps = (state: GlobalState) => ({
  nepAmount: state.runtime.nepAmount
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
    const initAmountNumber: number | undefined = get(props.location, 'state.amount', undefined);
    
    const initialValues: InitialValues = {
      amount: convertAmountToStr(initAmountNumber, 'NEP')
    };

    return withProps(
      {
        handleCancel: async () => {
          props.history.goBack();

          const requestId: string = get(props.location, 'state.requestId');
          await actions.resolveRequest(requestId, 'CANCELED');
        },
        handleConfirm: async (values: object) => {
          const requestId: string = get(props.location, 'state.requestId');

          const amountStr: string = get(values, 'amount', '0');
          const amount = convertAmountFromStr(amountStr, 'NEP');

          // todo: no type check TransferRequest
          await actions.updateRequest(requestId, {
            amount
          } as Partial<SwapRequest>);

          props.history.push('/confirm', { requestId, redirectSucess: '/sendComplete', redirectFail: '/sendFailed' });
        },
        handleMax: (formProps: FormRenderProps) => {
          let amountBN = convertAmountToBN(reduxProps.nepAmount, 'NEP');
          amountBN = amountBN.integerValue(BigNumber.ROUND_FLOOR);
          formProps.form.change('amount', amountBN.toString());
          return true;
        },
        initialValues,
        locked: get(props.location, 'state.locked', false),
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const Swap = enhancer(SwapView);
