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
import 'babel-polyfill';

import * as Ledger from '@ont-community/ontology-ts-sdk-ledger';
import * as Trezor from '@ont-community/ontology-ts-sdk-trezor';
import { Crypto } from 'ontology-ts-sdk';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './global.css';

import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { initHistory } from './history';
import {
  Clear,
  Create,
  Dashboard,
  Home,
  IdentityCheckFailed,
  IdentityClear,
  IdentityCreate,
  IdentityCreateConfirm,
  IdentityDashboard,
  IdentityHome,
  IdentityImport,
  IdentityNew,
  IdentityRestore,
  IdentitySignup,
  Import,
  LedgerCreate,
  LedgerImport,
  LedgerNew,
  LedgerSendConfirm,
  LedgerSignup,
  LedgerWithdrawConfirm,
  New,
  Receive,
  Restore,
  Send,
  SendComplete,
  SendConfirm,
  SendFailed,
  SettingsPage,
  Signup,
  Transfers,
  TrezorCreate,
  TrezorImport,
  TrezorNew,
  TrezorSendConfirm,
  TrezorSignup,
  TrezorWithdrawConfirm,
  WithdrawComplete,
  WithdrawConfirm,
  WithdrawFailed,
} from './pages';
import { initStore } from './redux';
import { requestsManager } from './requestsManager';
import { backgroundManager } from './backgroundManager';

Crypto.registerKeyDeserializer(new Ledger.LedgerKeyDeserializer());
Crypto.registerKeyDeserializer(new Trezor.TrezorKeyDeserializer());
Ledger.setLedgerTransport(
  new Ledger.LedgerTransportIframe('https://drxwrxomfjdx5.cloudfront.net/forwarder.html', true),
);

/**
 * Render after the redux store is connected to background script
 */
const store = initStore();
const unsubscribe = store.subscribe(() => {
  const history = initHistory(store);
  
  requestsManager.initialize(store, history);
  backgroundManager.initialize();

  
  const AppView: React.SFC<{}> = () => (
    <Provider store={store}>
      <Router history={history}>
        <>
          <Route path="/dashboard" exact={true} component={Dashboard} />
          <Route path="/send" exact={true} component={Send} />
          <Route path="/sendConfirm" exact={true} component={SendConfirm} />
          <Route path="/sendComplete" exact={true} component={SendComplete} />
          <Route path="/sendFailed" exact={true} component={SendFailed} />
          <Route path="/settings" exact={true} component={SettingsPage} />
          <Route path="/receive" exact={true} component={Receive} />
          <Route path="/transfers" exact={true} component={Transfers} />
          <Route path="/withdrawConfirm" exact={true} component={WithdrawConfirm} />
          <Route path="/withdrawComplete" exact={true} component={WithdrawComplete} />
          <Route path="/withdrawFailed" exact={true} component={WithdrawFailed} />

          <Route path="/" exact={true} component={Home} />
          <Route path="/new" exact={true} component={New} />
          <Route path="/clear" exact={true} component={Clear} />
          <Route path="/restore" exact={true} component={Restore} />
          <Route path="/import" exact={true} component={Import} />
          <Route path="/create" exact={true} component={Create} />
          <Route path="/sign-up" exact={true} component={Signup} />

          <Route path="/ledger/create" exact={true} component={LedgerCreate} />
          <Route path="/ledger/import" exact={true} component={LedgerImport} />
          <Route path="/ledger/new" exact={true} component={LedgerNew} />
          <Route path="/ledger/sendConfirm" exact={true} component={LedgerSendConfirm} />
          <Route path="/ledger/signup" exact={true} component={LedgerSignup} />
          <Route path="/ledger/withdrawConfirm" exact={true} component={LedgerWithdrawConfirm} />

          <Route path="/trezor/create" exact={true} component={TrezorCreate} />
          <Route path="/trezor/import" exact={true} component={TrezorImport} />
          <Route path="/trezor/new" exact={true} component={TrezorNew} />
          <Route path="/trezor/sendConfirm" exact={true} component={TrezorSendConfirm} />
          <Route path="/trezor/signup" exact={true} component={TrezorSignup} />
          <Route path="/trezor/withdrawConfirm" exact={true} component={TrezorWithdrawConfirm} />

          <Route path="/identity" exact={true} component={IdentityHome} />
          <Route path="/identity/checkFailed" exact={true} component={IdentityCheckFailed} />
          <Route path="/identity/clear" exact={true} component={IdentityClear} />
          <Route path="/identity/create" exact={true} component={IdentityCreate} />
          <Route path="/identity/createConfirm" exact={true} component={IdentityCreateConfirm} />
          <Route path="/identity/dashboard" exact={true} component={IdentityDashboard} />
          <Route path="/identity/import" exact={true} component={IdentityImport} />
          <Route path="/identity/new" exact={true} component={IdentityNew} />
          <Route path="/identity/restore" exact={true} component={IdentityRestore} />
          <Route path="/identity/sign-up" exact={true} component={IdentitySignup} />
        </>
      </Router>
    </Provider>
  );

  unsubscribe(); // make sure to only fire once
  ReactDOM.render(<AppView />, document.getElementById('root') as HTMLElement);
});
