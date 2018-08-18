import { Parameter } from 'ontology-dapi';
import { v4 as uuid } from 'uuid';
import { Deferred } from '../deffered';
import Actions from '../redux/actions';
import { GlobalStore } from '../redux/state';
import { ScCallReadRequest, ScCallRequest, TransactionRequestsState, TransferRequest } from '../redux/transactionRequests';
import { PopupManager } from './popUpManager';

/**
 * todo: when password remembering is implemented, it should be implemented here
 * instead of calling popup manager, the transfer/scCall can be made directly
 */
export class RequestsManager {
  private requestDeferreds: Map<string, Deferred<any>>;
  private store: GlobalStore;
  private popupManager: PopupManager;

  constructor(store: GlobalStore, popupManager: PopupManager) {
    this.requestDeferreds = new Map();
    this.store = store;
    this.popupManager = popupManager;

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
              deferred.resolve(request.result);
            } else {
              deferred.reject(request.error);
            }

            this.requestDeferreds.delete(request.id);
          }
        });
      }
    });
  }

  public async initTransfer(args: { recipient: string; asset: string; amount: number }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest({
        ...args,
        id: requestId,
        type: 'transfer',
      } as TransferRequest),
    );

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/send', { ...args, requestId, locked: true });

    return deferred.promise;
  }

  public async initScCall(args: {
    account: string;
    contract: string;
    method: string;
    parameters: Parameter[];
    gasPrice: number;
    gasLimit: number;
    addresses: string[];
  }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest({
        ...args,
        id: requestId,
        type: 'sc_call',
      } as ScCallRequest),
    );

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/call', {
      ...args,
      locked: true,
      requestId,
    });

    return deferred.promise;
  }

  public async initScCallRead(args: { contract: string; method: string; parameters: Parameter[] }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest({
        ...args,
        id: requestId,
        type: 'sc_call_read',
      } as ScCallReadRequest),
    );

    await this.store.dispatch(
      Actions.smartContract.scCallRead(args.contract, args.method, args.parameters, requestId)
    );

    return deferred.promise;
  }
}

let requestsManager: RequestsManager;

export function initRequestsManager(store: GlobalStore, popupManager: PopupManager) {
  requestsManager = new RequestsManager(store, popupManager);
  return requestsManager;
}

export function getRequestsManager() {
  return requestsManager;
}
