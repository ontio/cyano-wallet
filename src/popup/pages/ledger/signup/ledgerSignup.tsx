/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import { timeout } from 'promise-timeout';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { getBackgroundManager } from '../../../backgroundManager';
import { lifecycle, withProps, withState } from '../../../compose';
import { LedgerSignupView, Props } from './ledgerSignupView';

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
        async function checkStatus() {
          try {
            const supported = await timeout(getBackgroundManager().isLedgerSupported(), 10000);
            setState({ ...getState(), supported });
          } catch (e) {
            setState({ ...getState(), supported: false });
          }
        }

        const timer = window.setInterval(checkStatus, 10000);
        setState({ ...state, timer });

        await checkStatus();
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
          props.history.push('/ledger/create');
        },
        handleImport: () => {
          props.history.push('/ledger/import');
        }
      }, (injectedProps) => (
        <Component {...injectedProps} supported={state.supported} />
      ))
    ))
  ))
);

export const LedgerSignup = enhancer(LedgerSignupView);
