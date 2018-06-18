
import * as React from 'react';
import { RouterProps } from 'react-router';
import { GlobalState } from '../app/globalReducer';
import { getAddress } from '../auth/authApi';
import { reduxConnect, withProps } from '../compose';
import { Props, ReceiveView } from './receiveView';

const mapStateToProps = (state: GlobalState) => ({
  wallet: state.auth.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, undefined, (state) => (
    withProps({
      address: getAddress(state.wallet),
      handleReturn: () => {
        props.history.goBack();
      }
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ))
  ))
);

export const Receive = enhancer(ReceiveView);
