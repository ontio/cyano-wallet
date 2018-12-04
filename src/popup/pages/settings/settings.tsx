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
import * as FileSaver from 'file-saver';
import { get } from 'lodash';
import * as React from 'react';
import * as FileReaderInput from 'react-file-reader-input';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { getWallet } from '../../../api/authApi';
import { getIdentity } from '../../../api/identityApi';
import Actions from '../../../redux/actions';
import { NetValue } from '../../../redux/settings';
import { reduxConnect, withProps, withRouter } from '../../compose';
import { GlobalState } from '../../redux';
import { Props, SettingsView } from './settingsView';

const mapStateToProps = (state: GlobalState) => ({
  settings: state.settings,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setSettings: Actions.settings.setSettings,
      setWallet: Actions.wallet.setWallet,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter((routerProps) =>
    reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
      withProps(
        {
          enableClear: reduxProps.wallet !== null,
          enableClearIdentity: reduxProps.wallet !== null && getIdentity(reduxProps.wallet) !== null,

          handleCancel: () => {
            props.history.push('/');
          },
          handleClear: () => {
            routerProps.history.push('/clear');
          },
          handleClearIdentity: () => {
            routerProps.history.push('/identity/clear');
          },
          handleExport: () => {
            const blob = new Blob([reduxProps.wallet!], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(blob, 'wallet.dat');
          },
          handleImport: async (event: React.SyntheticEvent<{}>, results: FileReaderInput.Result[]) => {
            const [e] = results[0];

            if (e !== null && e.target !== null) {
              let data: string = get(e.target, 'result');

              // fix missing identities
              const parsed = JSON.parse(data);
              if (parsed.identities == null) {
                parsed.identities = [];
                data = JSON.stringify(parsed);
              }

              const wallet = getWallet(data);
              // sets default address for OWallet exports
              if (wallet.defaultAccountAddress == null || wallet.defaultAccountAddress === '') {
                wallet.defaultAccountAddress = wallet.accounts[0].address.toBase58();
              }

              await actions.setWallet(wallet.toJson());
              routerProps.history.push('/');
            }
          },
          handleSave: async (values: object) => {
            const net: NetValue = get(values, 'net', 'TEST');
            const address: string = get(values, 'address', '');
            const ssl: boolean = get(values, 'ssl', false);

            await actions.setSettings(address, ssl, net, reduxProps.settings.tokens, reduxProps.settings.trustedScs);
            props.history.replace('/dashboard');
          },
          handleTokenSettings: () => {
            routerProps.history.push('/settings/token');
          },
          handleTrustedScs: () => {
            routerProps.history.push('/settings/trusted');
          },
        },
        (injectedProps) => <Component {...injectedProps} settings={reduxProps.settings} />,
      ),
    ),
  );

export const SettingsPage = enhancer(SettingsView);
