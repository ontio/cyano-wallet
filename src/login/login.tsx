
import * as React from 'react';
import { withProps } from '../compose';
import { LoginView, Props } from './loginView';

interface PropsOuter {
  val?: string;
}

const enhancer = (Component: React.ComponentType<Props>) => (props: PropsOuter) => (
  withProps({
    handleSubmit: () => {
      // tslint:disable-next-line:no-console
      console.log('submitting');
    }
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
)

export const Login = enhancer(LoginView);
