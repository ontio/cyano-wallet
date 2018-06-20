
import * as React from 'react';
import { RouterProps } from 'react-router';
import { getAddress } from '../../api/authApi';
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { DashboardView, Props } from './dashboardView';

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.wallet.ongAmount,
  ontAmount: state.wallet.ontAmount,
  transfers: state.wallet.transfers,
  wallet: state.auth.wallet
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
      ownAddress: getAddress(reduxProps.wallet),
      transfers: reduxProps.transfers !== null ? reduxProps.transfers.slice(0, 2) : null
    }, (injectedProps) => (
      <Component {...injectedProps} ontAmount={reduxProps.ontAmount} ongAmount={reduxProps.ongAmount} />
    ))
  ))
);

export const Dashboard = enhancer(DashboardView);
