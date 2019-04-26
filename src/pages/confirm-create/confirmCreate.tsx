import * as React from 'react';
import { get } from 'lodash';
import { withProps } from '../../compose';
import { confirmCreateView, Props } from './confirmCreateView';
import { RouteComponentProps } from 'react-router';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const mnemonics = get(props.location, 'state.mnemonics', '');
  return (
    withProps({
      mnemonics,
      handleContinue: () => {
        props.history.push('/dashboard');
      },
      handleConfirm: (data) => {
          console.log('data :', data);
      }
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ))
  )
};
export const ConfirmCreate = enhancer(confirmCreateView);
