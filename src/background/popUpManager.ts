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
import { Rpc } from 'ontology-dapi';
import { browser } from 'webextension-polyfill-ts';
import { Deferred } from '../deffered';

// size of the popup. needs to be in sync with css.
const width = 350;
const height = 452;

class PopupManager {
  private rpc: Rpc;
  private popupId: number;

  private initialized: Deferred<void>;

  constructor() {
    this.show = this.show.bind(this);
    this.callMethod = this.callMethod.bind(this);

    this.rpc = new Rpc({
      addListener: browser.runtime.onMessage.addListener,
      destination: 'popup',
      postMessage: browser.runtime.sendMessage,
      source: 'background'
    });

    this.rpc.register('popup_initialized', () => {
      if (this.initialized !== undefined) {
        this.initialized.resolve();
      }
    })    
  }
  public async show() {
    let popup = await this.findPopup();
  
    if (popup !== null) {
      browser.windows.update(popup.id!, { focused: true });
    } else {
      this.initialized = new Deferred<void>();
      
      popup = await browser.windows.create({
        height,
        type: 'popup',
        url: 'popup.html',
        width,
      });
      this.popupId = popup.id!;   
      
      await this.initialized.promise;
    }
  }

  public async callMethod(method: string, ...params: any[]) {
    return this.rpc.call(method, ...params);
  }
  
  private async findPopup() {
    const windows = await browser.windows.getAll({
      windowTypes: ['popup'],
    });
  
    const ownWindows = windows.filter((w) => w.id === this.popupId);
  
    if (ownWindows.length > 0) {
      return ownWindows[0];
    } else {
      return null;
    }
  }
}

export const popupManager = new PopupManager();
