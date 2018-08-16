import { History } from 'history';
import { v4 as uuid } from 'uuid';
import { Deferred } from '../deffered';
import Actions from '../redux/actions';
import { GlobalStore } from '../redux/state';
import { TransactionRequestsState, TransferRequest } from '../redux/transactionRequests';
import { backgroundManager } from './backgroundManager';

class RequestsManager {
  private requestDeferreds: Map<string, Deferred<any>>;
  private store: GlobalStore;
  private history: History;
  private initialized: boolean;

  constructor() {
    this.requestDeferreds = new Map();
  }

  public initialize(store: GlobalStore, history: History) {
    this.store = store;
    this.history = history;
    
    let oldRequestsState: TransactionRequestsState;
    this.store.subscribe(() => {
      const state = this.store.getState();
      const requestsState = state.transactionRequests;

      if (oldRequestsState !== requestsState) {
        oldRequestsState = requestsState;

        const requests = requestsState.requests;

        requests.filter((request) => request.resolved).forEach((request) => {
          const deferred = this.requestDeferreds.get(request.id);

          if (deferred !== undefined) {
            if (request.error === undefined) {
              deferred.resolve();
            } else {
              deferred.reject(request.error);
            }

            this.requestDeferreds.delete(request.id);
          }
        });
      }
    });

    this.initialized = true;
    backgroundManager.registerMethod('init_transfer', this.initTransfer.bind(this));
  }

  public async initTransfer(recipient: string, asset: string, amount: number) {
    if (!this.initialized) {
      throw new Error('RequestManager is not initialized.');
    }

    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest({
        amount,
        asset,
        id: requestId,
        recipient,
        type: 'transfer',
      } as TransferRequest),
    );

    this.history.push('/send', { recipient, asset, amount, requestId, locked: true });

    return deferred.promise;
  }
}

export const requestsManager = new RequestsManager();
