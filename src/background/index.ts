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
import 'regenerator-runtime';

import bugsnag from '@bugsnag/js';
import * as Ledger from '@ont-dev/ontology-ts-sdk-ledger';
// import * as Trezor from '@ont-community/ontology-ts-sdk-trezor';
import { Crypto } from 'ontology-ts-sdk';
import { browser } from 'webextension-polyfill-ts';
import { initBalanceProvider } from './balanceProvider';
import { initBrowserAction } from './browserAction';
import { initDApiProvider } from './dapp';
import { initNetwork } from './network';
import { initSettingsProvider } from './persist/settingsProvider';
import { initWalletProvider } from './persist/walletProvider';
import { initPopupManager } from './popUpManager';
import { initStore } from './redux';
import { initRequestsManager } from './requestsManager';
import { initTorusProvider } from './torusProvider';

const bugsnagClient = bugsnag({
  apiKey: '162731d88707c7260689fba047f0a6a7',
  appType: 'background',
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

browser.management.getSelf().then((info) => {
  (bugsnagClient.app as any).version = info.version;
});

const store = initStore();
const popupManager = initPopupManager(store);

initNetwork(store);
initBalanceProvider(store);
initSettingsProvider(store);
initWalletProvider(store);
initRequestsManager(store, popupManager);
initDApiProvider();
initBrowserAction(popupManager);
initTorusProvider();
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
// Crypto.registerKeyDeserializer(new Trezor.TrezorKeyDeserializer());

Ledger.setLedgerTransport(new Ledger.LedgerTransportForwarder(
  async (msg) => {
    const popup = browser.extension.getViews({ type: 'tab' })[0];
    if (popup) {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => { 
          channel.port1.close();
          resolve(event.data);
        }
        popup.postMessage(msg, '*', [channel.port2]);
      });
    } else {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs[0] && tabs[0].id) {
        return browser.tabs.sendMessage(tabs[0].id, msg);
      }
    }
    throw new Error('ledger transport provider not found');
  }
));
