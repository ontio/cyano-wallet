
import { get } from 'lodash';
import * as React from 'react';
import { FormRenderProps } from 'react-final-form';
import { RouterProps } from 'react-router';
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
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
        const recipient = get(values, 'recipient', '');
        const asset = get(values, 'asset', '');
        const amount = get(values, 'amount', '');
        
        props.history.push('/sendConfirm', { recipient, asset, amount });
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
