
import * as React from 'react';
import { RouterProps } from 'react-router';
import { withProps } from '../compose';
import { Props, SendView } from './sendView';

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  withProps({
    handleConfirm: async (values: object) => {
      // tslint:disable-next-line:no-console
      console.log('confirm');
    },
    ongAmount: 1000.54,
    ontAmount: 2000
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
)

export const Send = enhancer(SendView);
