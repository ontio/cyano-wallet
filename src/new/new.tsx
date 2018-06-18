
import { get } from 'lodash';
import * as React from 'react';
import { RouteProps, RouterProps } from 'react-router';
import { withProps } from '../compose';
import { NewView, Props } from './newView';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps & RouteProps) => {
  
  const mnemonics = get(props.location, 'state.mnemonics', '');
  const wif = get(props.location, 'state.wif', '');
  const encryptedWif = get(props.location, 'state.encryptedWif', '');
  
  return (
    withProps({
      encryptedWif,
      handleContinue: () => {
        props.history.push('/dashboard');
      },
      mnemonics,
      wif
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ))
  )
};
export const New = enhancer(NewView);
