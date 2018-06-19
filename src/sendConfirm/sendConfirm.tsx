import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { GlobalState } from '../app/globalReducer';
import { reduxConnect, withProps } from '../compose';
import { finishLoading, startLoading } from '../loader/loaderActions';
import { transfer } from '../wallet/walletApi';
import { Props, SendConfirmView } from './sendConfirmView';

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.auth.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => (
    withProps({
      handleCancel: () => {
        props.history.goBack();
      },
      handleSubmit: async (values: object) => {
        const recipient: string = get(props.location, 'state.recipient', '');
        const asset: 'ONT' | 'ONG' = get(props.location, 'state.asset', '');
        const amount: string = get(props.location, 'state.amount', '');

        const password: string = get(values, 'password', '');

        actions.startLoading();

        await transfer(reduxProps.wallet, password, recipient, asset, amount);

        actions.finishLoading();

        props.history.push('/dashboard', { recipient, asset, amount });
      }
    }, (injectedProps) => (
      <Component {...injectedProps} loading={reduxProps.loading} />
    ))
  ))
)

export const SendConfirm = enhancer(SendConfirmView);
