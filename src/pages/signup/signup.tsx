
/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from 'react';
import { RouterProps } from 'react-router';
import { isLedgerSupported } from '../../api/ledgerApi';
import { lifecycle, withProps, withState } from '../../compose';
import { LoginOption, Props, SignupView } from './signupView';

interface State {
  loginOptions: LoginOption[];
}

const defaultState = {
  loginOptions: [{
    text: 'Normal',
    value: 'NORMAL'
  }]
};

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  withState<State>(defaultState, (state, setState) => (
    lifecycle({
      componentDidMount: async () => {
        const ledgerSupported = await isLedgerSupported();
        // tslint:disable-next-line:no-console
        console.log('ledger:', ledgerSupported);

        if (ledgerSupported) {
          const newState = {
            ...state, 
            loginOptions: [ 
              ...defaultState.loginOptions, 
              { text: 'Ledger', value: 'LEDGER' }
            ]
          };

          setState(newState);
        }
      }
    }, () =>  (
      withProps({
        handleCreate: () => {
          props.history.push('/create');
        },
        handleCreateAdvanced: (value: string) => {
          if (value === 'LEDGER') {
            props.history.push('/ledger/create');
          } else {
            props.history.push('/create');
          }
        },
        handleImport: () => {
          props.history.push('/import');
        },
        handleImportAdvanced: (value: string) => {
          if (value === 'LEDGER') {
            props.history.push('/ledger/import');
          } else {
            props.history.push('/import');
          }
        },
        handleRestore: () => {
          props.history.push('/restore');
        }
      }, (injectedProps) => (
        <Component {...injectedProps} loginOptions={state.loginOptions} />
      ))
    ))
  ))
);

export const Signup = enhancer(SignupView);
