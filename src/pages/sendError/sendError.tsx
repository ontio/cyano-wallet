import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withProps } from '../../compose';
import { Props, SendErrorView } from './sendErrorView';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => (
  withProps({
    message: get(props.location, 'state.e', ''),
    handleOk: () => {
      props.history.push('/dashboard');
    },
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
);

export const SendError = enhancer(SendErrorView);
