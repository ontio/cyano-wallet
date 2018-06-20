
import * as React from 'react';
import { RouterProps } from 'react-router';
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { DashboardView, Props } from './dashboardView';


const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.wallet.ongAmount,
  ontAmount: state.wallet.ontAmount
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
