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
import { browser } from 'webextension-polyfill-ts';
import { initBalanceProvider } from './balanceProvider';
import { initDApiProvider } from './dapp';
import { initNetwork } from './network';
import { initSettingsProvider } from './persist/settingsProvider';
import { initWalletProvider } from './persist/walletProvider';
import { initStore } from './redux';

const store = initStore();
initNetwork(store);
initBalanceProvider(store);
initSettingsProvider(store);
initWalletProvider(store);
initDApiProvider();

// pretends we are hosted on https://extension.trezor.io so trezor bridge will allow communication
browser.webRequest.onBeforeSendHeaders.addListener(
  (e) => {
    if (e.requestHeaders !== undefined) {
      for (const header of e.requestHeaders) {
        if (header.name.toLowerCase() === 'origin') {
          header.value = 'https://extension.trezor.io';
        }
      }
    }
    return { requestHeaders: e.requestHeaders };
  },
  { urls: ['http://127.0.0.1/*'] },
  ['blocking', 'requestHeaders'],
);

Crypto.registerKeyDeserializer(new Ledger.LedgerKeyDeserializer());
Crypto.registerKeyDeserializer(new Trezor.TrezorKeyDeserializer());
Ledger.setLedgerTransport(
  new Ledger.LedgerTransportIframe('https://drxwrxomfjdx5.cloudfront.net/forwarder.html', true),
);
