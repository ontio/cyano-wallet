
import * as React from 'react';
import { RouterProps } from 'react-router';
import { GlobalState } from '../app/globalReducer';

import { dummy, reduxConnect, withProps } from '../compose';
import { DashboardView, Props } from './dashboardView';


const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.wallet.ongAmount,
  ontAmount: state.wallet.ontAmount,
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
      }
    }, (injectedProps) => (
      <Component {...injectedProps} ontAmount={reduxProps.ontAmount} ongAmount={reduxProps.ongAmount} />
    ))
  ))
);

export const Dashboard = enhancer(DashboardView);
