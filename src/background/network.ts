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
import { CONST, WebsocketClient } from 'ontology-ts-sdk';
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

function reconnect(s: SettingsState) {
  const url = `${s.ssl ? 'wss' : 'ws'}://${getNodeAddress()}:${CONST.HTTP_WS_PORT}`;
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
  } else if (settings.net === 'MAIN') {
    return CONST.MAIN_NODE;
  } else if (settings.net === 'TEST') {
    return CONST.TEST_NODE;
  } else if (settings.net === 'PRIVATE') {
    return settings.address;
  } else {
    throw new Error('Wrong net');
  }
}

export function getNeoNodeAddress(): string {
  return 'http://neonode1.ont.network:10332';
}
