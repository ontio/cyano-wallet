
import * as React from 'react';
import { withProps, withRouter } from '../compose';
import { LogoHeaderView, Props } from './logoHeaderView';

interface OuterProps {
  showLogout: boolean;
  title: string;
}


const enhancer = (Component: React.ComponentType<Props>) => (props: OuterProps) => (
  withRouter(routerProps => (
    withProps({
      handleLogout: () => {
        routerProps.history.push('/');
      }
    }, (injectedProps) => (
      <Component {...injectedProps} title={props.title} showLogout={props.showLogout} />
    ))
  ))
);

export const LogoHeader = enhancer(LogoHeaderView);
