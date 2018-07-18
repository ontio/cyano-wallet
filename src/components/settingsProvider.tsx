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
import { CONST } from 'ontology-ts-sdk';
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { loadSettings } from '../api/settingsApi';
import { dummy, lifecycle, reduxConnect, withState } from '../compose';
import { setNodeAddress } from '../redux/settings/settingsActions';
import { Nothing } from './nothing';

interface State {
  loaded: boolean;
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setNodeAddress }, dispatch);

export const SettingsProvider: React.SFC<{}> = (props) => (
  reduxConnect(dummy, mapDispatchToProps, (reduxProps, actions) => (
    withState<State>({ loaded: false }, (state, setState) => (
      lifecycle({
        componentDidMount: async () => {
          const settings = await loadSettings();

          let explorerAddress: string | null = null;
          let nodeAddress = '';
          let ssl = false;
          if (settings.net === 'MAIN') {
            nodeAddress = CONST.MAIN_NODE;
            explorerAddress = 'explorer.ont.io';
          } else if (settings.net === 'TEST') {
            nodeAddress = CONST.TEST_NODE;
            explorerAddress = 'polarisexplorer.ont.io';
          } else if (settings.net === 'PRIVATE') {
            nodeAddress = settings.address;
            explorerAddress = null;
            ssl = settings.ssl;
          }

          actions.setNodeAddress(nodeAddress, ssl, explorerAddress);
          setState({ ...state, loaded: true });
        }
      }, () => state.loaded ? (<>{props.children}</>) : (<Nothing />)
      )
    ))
  ))
);
