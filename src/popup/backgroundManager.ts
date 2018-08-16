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
import { MethodType, Rpc } from 'ontology-dapi';
import { browser } from 'webextension-polyfill-ts';

class BackgroundManager {
    private rpc: Rpc;

    constructor() {
      this.rpc = new Rpc({
        addListener: browser.runtime.onMessage.addListener,
        destination: 'background',
        logMessages: true,
        postMessage: browser.runtime.sendMessage,
        source: 'popup'
      });
    }

    public initialize() {
      this.rpc.call('popup_initialized');
    }

    public registerMethod(name: string, method: MethodType) {
      this.rpc.register(name, method);
    }
 }

 export const backgroundManager = new BackgroundManager();
