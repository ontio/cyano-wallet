
import { get } from 'lodash';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { GlobalState } from '../app/globalReducer';
import { dummy, reduxConnect, withProps } from '../compose';
import { Props, SendView } from './sendView';

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.wallet.ongAmount,
  ontAmount: state.wallet.ontAmount
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, dummy, (reduxProps) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleConfirm: async (values: object) => {
        // tslint:disable-next-line:no-console
        console.log('values', values);
        const recipient = get(values, 'recipient', '');
        const asset = get(values, 'asset', '');
        const amount = get(values, 'amount', '');
        
        props.history.push('/sendConfirm', { recipient, asset, amount });
      }
    }, (injectedProps) => (
      <Component {...injectedProps} ontAmount={reduxProps.ontAmount} ongAmount={reduxProps.ongAmount} />
    ))
  ))
)

export const Send = enhancer(SendView);
