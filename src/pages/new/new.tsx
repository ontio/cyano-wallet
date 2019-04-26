import { get } from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withProps } from '../../compose';
import { NewView, Props } from './newView';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const mnemonics = get(props.location, 'state.mnemonics', '');
  const wif = get(props.location, 'state.wif', '');
  const encryptedWif = get(props.location, 'state.encryptedWif', '');
  
  return (
    withProps({
      encryptedWif,
      handleContinue: () => {
        props.history.push('/confirm-create',  props.location.state);
      },
      mnemonics,
      wif
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ))
  )
};
export const New = enhancer(NewView);
