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
import { v4 as uuid } from 'uuid';
import { browser } from 'webextension-polyfill-ts';
import { Deferred } from '../deffered';
import Actions from '../redux/actions';
import { GlobalStore } from '../redux/state';
import { TransactionRequestsState, TransferRequest } from '../redux/transactionRequests';
import { getHistory } from './history';

const requestDeferreds = new Map<string, Deferred<any>>();

export function initBackChannel(store: GlobalStore) {
  let oldRequestsState: TransactionRequestsState;

  store.subscribe(() => {
    const state = store.getState();
    const requestsState = state.transactionRequests;

    if (oldRequestsState !== requestsState) {
      oldRequestsState = requestsState;

      const requests = requestsState.requests;

      requests.filter((request) => request.resolved).forEach((request) => {
        const deferred = requestDeferreds.get(request.id);

        if (deferred !== undefined) {
          if (request.error === undefined) {
            deferred.resolve();
          } else {
            deferred.reject({ error: request.error });
          }

          requestDeferreds.delete(request.id);
        }
      });
    }
  });

  browser.runtime.onMessage.addListener(async (request, sender) => {
    if (request.operation === 'init_transfer') {
      console.log("front");
      const { recipient, asset, amount } = request;

      const requestId = uuid();

      // stores deferred object to resolve when the transaction is resolved
      const deferred = new Deferred();
      requestDeferreds.set(requestId, deferred);

      await store.dispatch(
        Actions.transactionRequests.addRequest({
          amount,
          asset,
          id: requestId,
          recipient,
          type: 'transfer',
        } as TransferRequest),
      );

      const history = getHistory();
      history.push('/send', { recipient, asset, amount, requestId, locked: true });

      return deferred.promise;
    }
  });
}
