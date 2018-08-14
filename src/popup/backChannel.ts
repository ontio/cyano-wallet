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
import { browser } from 'webextension-polyfill-ts';
import { getHistory } from './history';

export function registerBackChannel() {
  browser.runtime.onMessage.addListener((request, sender) => {
    if (request.operation === 'init_transfer') {
      const { recipient, asset, amount } = request;
      console.log('amount', amount);

      const history = getHistory();
      history.push('/send', { recipient, asset, amount });

      // fixme: wait for the transfer to go through
      

      return Promise.resolve();
    }
  });
}
