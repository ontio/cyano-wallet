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
import 'babel-polyfill';

import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import * as Ledger from '@ont-dev/ontology-ts-sdk-ledger';
// import * as Trezor from '@ont-community/ontology-ts-sdk-trezor';
import { Crypto } from 'ontology-ts-sdk';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { browser } from 'webextension-polyfill-ts';
import './global.css';

import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { initSettingsProvider } from '../background/persist/settingsProvider';
import { initBackgroundManager } from './backgroundManager';
import { initHistory } from './history';
import * as Pages from './pages';
import { initStore } from './redux';


const bugsnagClient = bugsnag({
  apiKey: '162731d88707c7260689fba047f0a6a7',
  appType: 'popup',
  beforeSend: (report) => {
    report.stacktrace = report.stacktrace.map((frame) => {
      frame.file = frame.file.replace(/chrome-extension:/g, 'keepinghrome:');
      return frame;
    });
  },
  collectUserIp: false,
  filters: [
    /^password$/i, // case-insensitive: "password", "PASSWORD", "PaSsWoRd"
  ],
});

bugsnagClient.use(bugsnagReact, React);

browser.management.getSelf().then((info) => {
  (bugsnagClient.app as any).version = info.version;
});

Crypto.registerKeyDeserializer(new Ledger.LedgerKeyDeserializer());
// Crypto.registerKeyDeserializer(new Trezor.TrezorKeyDeserializer());

const ledgerTransportProvider = new Ledger.LedgerTransportProvider(
  new Ledger.LedgerTransportWebusb(),
  (onMessage) => {
    const listener = async (event: MessageEvent) => {
      const result = await onMessage(event.data);
      if (event.ports[0]) {
        event.ports[0].postMessage(result);
        event.ports[0].close();
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    }
  },
);
ledgerTransportProvider.start();

/**
 * Render after the redux store is connected to background script
 */
const store = initStore();
initSettingsProvider(store); // Fixme:在这里添加一次初始化才能加上默认的oep4
const unsubscribe = store.subscribe(() => {
  const history = initHistory(store);
  initBackgroundManager(history);

  const AppView: React.SFC<{}> = () => (
    <Provider store={store}>
      <Router history={history}>
        <>
          <Route path="/dashboard" exact={true} component={Pages.Dashboard} />
          <Route path="/send" exact={true} component={Pages.Send} />
          <Route path="/swap" exact={true} component={Pages.Swap} />
          <Route path="/confirm" exact={true} component={Pages.Confirm} />
          <Route path="/confirm-normal" exact={true} component={Pages.ConfirmNormal} />
          <Route path="/sendComplete" exact={true} component={Pages.SendComplete} />
          <Route path="/sendFailed" exact={true} component={Pages.SendFailed} />
          <Route path="/settings" exact={true} component={Pages.SettingsPage} />
          <Route path="/settings/token" exact={true} component={Pages.TokenSettings} />
          <Route path="/settings/token/add" exact={true} component={Pages.TokenSettingsAdd} />
          <Route path="/settings/token/del" exact={true} component={Pages.TokenSettingsDel} />
          <Route path="/settings/trusted" exact={true} component={Pages.TrustedScs} />
          <Route path="/settings/trusted/add" exact={true} component={Pages.TrustedScsAdd} />
          <Route path="/settings/trusted/del" exact={true} component={Pages.TrustedScsDel} />
          <Route path="/receive" exact={true} component={Pages.Receive} />
          <Route path="/transfers" exact={true} component={Pages.Transfers} />

          <Route path="/message-sign" exact={true} component={Pages.MessageSign} />
          <Route path="/stateChannel-login" exact={true} component={Pages.StateChannelLogin} />

          <Route path="/" exact={true} component={Pages.Home} />
          <Route path="/new" exact={true} component={Pages.New} />
          <Route path="/clear" exact={true} component={Pages.Clear} />
          <Route path="/restore" exact={true} component={Pages.Restore} />
          <Route path="/import" exact={true} component={Pages.Import} />
          <Route path="/create" exact={true} component={Pages.Create} />
          <Route path="/sign-up" exact={true} component={Pages.Signup} />

          <Route path="/ledger/create" exact={true} component={Pages.LedgerCreate} />
          <Route path="/ledger/import" exact={true} component={Pages.LedgerImport} />
          <Route path="/ledger/new" exact={true} component={Pages.LedgerNew} />
          <Route path="/ledger/confirm" exact={true} component={Pages.LedgerConfirm} />
          <Route path="/ledger/signup" exact={true} component={Pages.LedgerSignup} />

          <Route path="/trezor/create" exact={true} component={Pages.TrezorCreate} />
          <Route path="/trezor/import" exact={true} component={Pages.TrezorImport} />
          <Route path="/trezor/new" exact={true} component={Pages.TrezorNew} />
          <Route path="/trezor/confirm" exact={true} component={Pages.TrezorConfirm} />
          <Route path="/trezor/signup" exact={true} component={Pages.TrezorSignup} />

          <Route path="/identity" exact={true} component={Pages.IdentityHome} />
          <Route path="/identity/checkFailed" exact={true} component={Pages.IdentityCheckFailed} />
          <Route path="/identity/clear" exact={true} component={Pages.IdentityClear} />
          <Route path="/identity/create" exact={true} component={Pages.IdentityCreate} />
          <Route path="/identity/dashboard" exact={true} component={Pages.IdentityDashboard} />
          <Route path="/identity/import" exact={true} component={Pages.IdentityImport} />
          <Route path="/identity/new" exact={true} component={Pages.IdentityNew} />
          <Route path="/identity/restore" exact={true} component={Pages.IdentityRestore} />
          <Route path="/identity/sign-up" exact={true} component={Pages.IdentitySignup} />

          <Route path="/call" exact={true} component={Pages.Call} />
          <Route path="/deploy" exact={true} component={Pages.Deploy} />

          <Route path="/account/change" exact={true} component={Pages.Accounts} />
          <Route path="/account/add" exact={true} component={Pages.AccountsAdd} />
          <Route path="/account/del" exact={true} component={Pages.AccountsDel} />

          <Route path="/identity/change" exact={true} component={Pages.Identities} />
          <Route path="/identity/add" exact={true} component={Pages.IdentitiesAdd} />
          <Route path="/identity/del" exact={true} component={Pages.IdentitiesDel} />
        </>
      </Router>
    </Provider>
  );

  unsubscribe(); // make sure to only fire once

  const ErrorBoundary = bugsnagClient.getPlugin('react');

  ReactDOM.render(
    <ErrorBoundary>
      <AppView />
    </ErrorBoundary>,
    document.getElementById('root') as HTMLElement,
  );
});
