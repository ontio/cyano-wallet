
import * as React from 'react';
import { RouterProps } from 'react-router';
import { withProps } from '../compose';
import { Props, ReceiveView } from './receiveView';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  withProps({
    address: 'AHVFvEzdF8zncC9BmBGyzBy4NJVNyVP2S6',
    handleReturn: () => {
      props.history.goBack();
    }    
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
)

export const Receive = enhancer(ReceiveView);
