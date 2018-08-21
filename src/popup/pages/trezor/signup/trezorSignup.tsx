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
import { isTrezorSupported } from '../../../../api/trezorApi';
import { lifecycle, withProps, withState } from '../../../compose';
import { Props, TrezorSignupView } from './trezorSignupView';

interface State {
  supported: boolean;
  timer: number;
}

const defaultState = {
  supported: false,
  timer: -1
};

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  withState<State>(defaultState, (state, setState, getState) => (
    lifecycle({
      componentDidMount: async () => {
        const timer = window.setInterval(async () => {
          
          const supported = await isTrezorSupported();
          setState({ ...getState(), supported });
        }, 2000);

        setState({ ...state, timer });
      },

      componentWillUnmount: () => {
        window.clearInterval(getState().timer);
      }
    }, () => (
      withProps({
        handleCancel: () => {
          props.history.goBack();
        },
        handleCreate: () => {
          props.history.push('/trezor/create');
        },
        handleImport: () => {
          props.history.push('/trezor/import');
        }
      }, (injectedProps) => (
        <Component {...injectedProps} supported={state.supported} />
      ))
    ))
  ))
);

export const TrezorSignup = enhancer(TrezorSignupView);
