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
import { History } from 'history';
 import { Rpc } from 'ontology-dapi';
import { browser } from 'webextension-polyfill-ts';

class BackgroundManager {
    private rpc: Rpc;
    private history: History;

    constructor(history: History) {
      this.history = history;
      this.rpc = new Rpc({
        addListener: browser.runtime.onMessage.addListener,
        destination: 'background',
        logMessages: true,
        postMessage: browser.runtime.sendMessage,
        source: 'popup'
      });

      this.rpc.register('history_push', this.historyPush.bind(this));
      this.rpc.call('popup_initialized');
    }

    public historyPush(path: string, state: any) {
      this.history.push(path, state);
    }
 }

 export function initBackgroundManager(history: History) {
   return new BackgroundManager(history);
 }
