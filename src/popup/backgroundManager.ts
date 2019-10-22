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
import { Rpc } from '@ont-dev/ontology-dapi';
import { History } from 'history';
import { browser } from 'webextension-polyfill-ts';
import { OEP4Token } from '../api/tokenApi';

class BackgroundManager {
  private rpc: Rpc;
  private history: History;

  constructor(history: History) {
    this.history = history;
    this.rpc = new Rpc({
      addListener: browser.runtime.onMessage.addListener,
      destination: 'background',
      logMessages: false,
      postMessage: browser.runtime.sendMessage,
      source: 'popup',
    });

    this.rpc.register('history_push', this.historyPush.bind(this));
    this.rpc.call('popup_initialized');
  }

  public checkAccountPassword(password: string) {
    return this.rpc.call<boolean>('check_account_password', password);
  }

  public checkIdentityPassword(password: string) {
    return this.rpc.call<boolean>('check_identity_password', password);
  }

  public checkOntId(encodedIdentity: string, password: string) {
    return this.rpc.call<boolean>('check_ont_id', encodedIdentity, password);
  }

  public getOEP4Token(contract: string) {
    return this.rpc.call<OEP4Token>('get_oep4_token', contract);
  }

  public isLedgerSupported() {
    return this.rpc.call<boolean>('is_ledger_supported');
  }

  public importLedgerKey(index: number, neo: boolean) {
    return this.rpc.call<{ wallet: string }>('import_ledger_key', index, neo);
  }

  public refreshBalance() {
    return this.rpc.call<void>('refresh_balance');
  }

  private historyPush(path: string, state: any) {
    this.history.push(path, state);
  }
}

let backgroundManager: BackgroundManager;

export function initBackgroundManager(history: History) {
  backgroundManager = new BackgroundManager(history);
  return backgroundManager;
}

export function getBackgroundManager() {
  return backgroundManager;
}
