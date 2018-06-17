
import { utils } from 'ont-sdk-ts';
import { Crypto } from 'ont-sdk-ts';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { withProps } from '../compose';
import { NewView, Props } from './newView';

import PrivateKey = Crypto.PrivateKey;

const mnemonics = utils.generateMnemonic(16);
const privateKey = PrivateKey.generateFromMnemonic(mnemonics);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  withProps({
    encryptedPrivateKey: privateKey.key,
    handleContinue: () => {
      props.history.push('/dashboard');
    },
    mnemonics
  }, (injectedProps) => (
    <Component {...injectedProps} />
  ))
)

export const New = enhancer(NewView);
