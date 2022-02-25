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
import { CONST, WebsocketClient } from 'ontology-ts-sdk';
import { prodOptions, testOptions } from 'src/api/constants';
import Actions from '../redux/actions';
import { compareSettings, SettingsState } from '../redux/settings';
import { GlobalStore } from '../redux/state';

let client: WebsocketClient;
let settings: SettingsState | null = null;

export function initNetwork(store: GlobalStore) {
  store.subscribe(() => {
    const state = store.getState();
    const newSettings = state.settings;

    if (!compareSettings(settings, newSettings)) {
      settings = newSettings;

      reconnect(newSettings);
    }
  });

  window.setInterval(async () => {
    try {
      await client.sendHeartBeat();
      store.dispatch(Actions.status.changeNetworkState('CONNECTED'));
    } catch (e) {
      if (settings != null) {
        reconnect(settings);
      }

      store.dispatch(Actions.status.changeNetworkState('DISCONNECTED'));
    }
  }, 5000);
}

function constructUrl(s: SettingsState) {
  let url: URL;

  const nodeAddress = getNodeAddress();
  if (nodeAddress != null) {
    let useScheme: boolean = true;

    if (nodeAddress.startsWith('wss://') || nodeAddress.startsWith('ws://')) {
      useScheme = false;
    }

    try {
      if (useScheme) {
        url = new URL(`wss://${nodeAddress}:${CONST.HTTPS_WS_PORT}`);
      } else {
        url = new URL(`${nodeAddress}:${CONST.HTTPS_WS_PORT}`);
      }
    } catch (e) {
      // try without port if already specified
      if (useScheme) {
        url = new URL(`${s.ssl ? 'wss' : 'ws'}://${nodeAddress}`);
      } else {
        url = new URL(nodeAddress);
      }
    }
  } else {
    throw new Error('Can not construct address');
  }

  return url.href;
}

function reconnect(s: SettingsState) {
  if (client !== undefined) {
    try {
      client.close();
    } catch (e) {
      // ignored
    }
  }

  const url = constructUrl(s);
  client = new WebsocketClient(url, false, false);
}

export function getClient(): WebsocketClient {
  return client;
}

export function getExplorerAddress(): string | null {
  if (settings === null) {
    return null;
  } else if (settings.net === 'MAIN') {
    return 'explorer.ont.io';
  } else if (settings.net === 'TEST') {
    return 'polarisexplorer.ont.io';
  } else {
    return null;
  }
}

export function getNodeAddress(): string | null {
  if (settings == null) {
    return null;
  }

  const address = settings.address;

  if (settings.net === 'MAIN') {
    if (isProdAddress(address)) {
      return address;
    }
    return CONST.MAIN_NODE;
  } else if (settings.net === 'TEST') {
    if (isTestAddress(address)) {
      return address;
    }
    return CONST.TEST_NODE;
  } else if (settings.net === 'PRIVATE') {
    return settings.address;
  } else {
    throw new Error('Wrong net');
  }
}

function isAddress(address: string) {
  return address !== undefined && address.trim() !== '';
}

function isProdAddress(address: string) {
  return isAddress(address) && prodOptions.map((o) => o.value).includes(address);
}

function isTestAddress(address: string) {
  return isAddress(address) && testOptions.map((o) => o.value).includes(address);
}

export function getNeoNodeAddress(): string {
  return 'http://neonode1.ont.network:10332';
}
