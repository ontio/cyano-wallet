
import * as React from 'react';
import { RouterProps } from 'react-router';
import { getAddress } from '../../api/authApi';
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { Props, TransfersView } from './transfersView';


const mapStateToProps = (state: GlobalState) => ({
  transfers: state.wallet.transfers,
  wallet: state.auth.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, dummy, (reduxProps) => (
    withProps({
      handleBack: () => {
        props.history.push('/dashboard');
      },
      ownAddress: getAddress(reduxProps.wallet)
    }, (injectedProps) => (
      <Component {...injectedProps} transfers={reduxProps.transfers} />
    ))
  ))
);

export const Transfers = enhancer(TransfersView);
