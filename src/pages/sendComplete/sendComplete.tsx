import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withProps } from '../../compose';
import { Props, SendCompleteView } from './sendCompleteView';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  
    withProps({
      amount: get(props.location, 'state.amount', ''),
      asset: get(props.location, 'state.asset', ''),
      handleCancel: () => {
        props.history.goBack();
      },
      handleOk: () => {
        props.history.push('/dashboard');
      },
      recipient: get(props.location, 'state.recipient', '')
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ))
  
)

export const SendComplete = enhancer(SendCompleteView);
