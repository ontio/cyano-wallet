import 'regenerator-runtime';

import { provider } from '@ont-dev/ontology-dapi';
import * as Ledger from '@ont-dev/ontology-ts-sdk-ledger'
import { browser } from 'webextension-polyfill-ts';

provider.registerContentProxy({});

const ledgerTransportProvider = new Ledger.LedgerTransportProvider(
  new Ledger.LedgerTransportWebusb(),
  (onMessage) => {
    browser.runtime.onMessage.addListener(onMessage);
    return () => {
      browser.runtime.onMessage.removeListener(onMessage);
    }
  }
);
ledgerTransportProvider.start();