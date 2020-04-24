import { Parameter, VmType } from '@ont-dev/ontology-dapi';
import { getWallet } from 'src/api/authApi';
import { hasIdentity } from 'src/api/identityApi';
import { TrustedSc } from 'src/redux/settings';
import { v4 as uuid } from 'uuid';
import { Deferred } from '../deffered';
import Actions from '../redux/actions';
import { AssetType } from '../redux/runtime';
import { GlobalStore } from '../redux/state';
import {
  FsCallRequest,
  FsMethod,
  MessageSignRequest,
  ScCallReadRequest,
  ScCallRequest,
  ScDeployRequest,
  StateChannelLoginRequest,
  TransactionRequestsState,
  TransferRequest,
} from '../redux/transactionRequests';
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

        requests
          .filter((request) => request.resolved)
          .forEach((request) => {
            const deferred = this.requestDeferreds.get(request.id);

            if (deferred !== undefined) {
              if (request.error === undefined) {
                deferred.resolve(request.result);
              } else {
                deferred.reject(request.result !== undefined ? request.result : request.error);
              }

              this.requestDeferreds.delete(request.id);
            }
          });
      }
    });
  }

  public async initTransfer(args: { recipient: string; asset: AssetType; amount: number }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<TransferRequest>({
        ...args,
        id: requestId,
        sender: '',
        type: 'transfer',
      }),
    );

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/send', { ...args, requestId, locked: true });

    return deferred.promise;
  }

  public async initMessageSign(args: { message: string, useIdentity?: boolean }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<MessageSignRequest>({
        ...args,
        id: requestId,
        type: 'message_sign',
      }),
    );

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/message-sign', { ...args, requestId, locked: true });

    return deferred.promise;
  }

  public async initStateChannelLogin() {
    const requestId = uuid();
    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<StateChannelLoginRequest>({
        id: requestId,
        type: 'stateChannel_login',
      }),
    );

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/stateChannel-login', { requestId, locked: true });

    return deferred.promise;
  }

  public async initFsCall(args: {
    method: FsMethod;
    parameters?: {
      [index: string]: any
    };
    paramsHash?: string;
    gasPrice?: number;
    gasLimit?: number;
  }) {
    const state = this.store.getState();

    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<FsCallRequest>({
        ...args,
        id: requestId,
        type: 'fs_call'
      })
    );

    const password = state.password.password;
    const trustedScs = state.settings.trustedScs as TrustedSc[];

    if (password !== undefined) {
      // check if we already have password stored
      // whitelisting is not supported for account+identity sign

      const trustedSc = trustedScs.find(
        ({contract, method, paramsHash, trustedFileHash}) =>
          contract === 'fs' &&
          (
            (method === undefined || method === args.method) &&
            (paramsHash === undefined || paramsHash === args.paramsHash)
          ) || (
            (method === 'FsGenFileReadSettleSlice' && args.method === 'FsGenFileReadSettleSlice') &&
            (args.parameters && trustedFileHash === args.parameters.fileHash)
          ),
      );

      if (trustedSc !== undefined) {
        if (trustedSc.password === false && trustedSc.confirm === false) {
          // check if password and confirm are not required

          await this.store.dispatch(Actions.transactionRequests.submitRequest(requestId, password));
          return deferred.promise;
        } else if (trustedSc.confirm === false && trustedSc.password !== false) {
          // check if confirm is not required and password is

          await this.popupManager.show();
          await this.popupManager.callMethod('history_push', '/confirm', {
            redirectFail: '/sendFailed',
            redirectSucess: '/dashboard',
            requestId,
          });

          return deferred.promise;
        }
      }
    }

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/call', {
      ...args,
      isFsCall: true,
      locked: true,
      requestId,
    });

    return deferred.promise;
  }

  public async initScCall(args: {
    isWasmVm: boolean;
    contract: string;
    method: string;
    parameters?: Parameter[];
    paramsHash?: string;
    gasPrice?: number;
    gasLimit?: number;
    requireIdentity?: boolean;
  }) {
    const state = this.store.getState();
    const wallet = getWallet(state.wallet.wallet!);

    if (args.requireIdentity && !hasIdentity(wallet)) {
      return Promise.reject('NO_IDENTITY');
    }

    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<ScCallRequest>({
        ...args,
        id: requestId,
        type: 'sc_call',
      }),
    );

    const password = state.password.password;
    const trustedScs = state.settings.trustedScs;

    if (password !== undefined && args.requireIdentity !== true) {
      // check if we already have password stored
      // whitelisting is not supported for account+identity sign

      const trustedSc = trustedScs.find(
        (t) =>
          t.contract === args.contract &&
          (t.method === undefined || t.method === args.method) &&
          (t.paramsHash === undefined || t.paramsHash === args.paramsHash),
      );

      if (trustedSc !== undefined) {
        if (trustedSc.password === false && trustedSc.confirm === false) {
          // check if password and confirm are not required

          await this.store.dispatch(Actions.transactionRequests.submitRequest(requestId, password));
          return deferred.promise;
        } else if (trustedSc.confirm === false && trustedSc.password !== false) {
          // check if confirm is not required and password is

          await this.popupManager.show();
          await this.popupManager.callMethod('history_push', '/confirm', {
            redirectFail: '/sendFailed',
            redirectSucess: '/dashboard',
            requestId,
          });

          return deferred.promise;
        }
      }
    }

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/call', {
      ...args,
      locked: true,
      requestId,
    });

    return deferred.promise;
  }

  public async initScCallRead(args: { isWasmVm: boolean; contract: string; method: string; parameters?: Parameter[] }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<ScCallReadRequest>({
        ...args,
        id: requestId,
        type: 'sc_call_read',
      }),
    );

    await this.store.dispatch(Actions.transactionRequests.submitRequest(requestId));

    return deferred.promise;
  }

  public async initScDeploy(args: {
    code: string;
    name?: string;
    version?: string;
    author?: string;
    email?: string;
    description?: string;
    vmType?: VmType | boolean;
    gasPrice?: number;
    gasLimit?: number;
  }) {
    const requestId = uuid();

    // stores deferred object to resolve when the transaction is resolved
    const deferred = new Deferred<any>();
    this.requestDeferreds.set(requestId, deferred);

    await this.store.dispatch(
      Actions.transactionRequests.addRequest<ScDeployRequest>({
        ...args,
        id: requestId,
        type: 'sc_deploy',
        vmType: args.vmType!,
      }),
    );

    await this.popupManager.show();
    await this.popupManager.callMethod('history_push', '/deploy', {
      ...args,
      locked: true,
      requestId,
    });

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
