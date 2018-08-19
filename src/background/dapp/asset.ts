import { Asset, AssetApi } from 'ontology-dapi';
import { getAddress, getAddressPk } from '../../api/accountApi';
import { getStore } from '../redux';
import { getRequestsManager } from '../requestsManager';

export const assetApi: AssetApi = {
  getOwnAccounts(): Promise<string[]> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_ACCOUNT');
    }

    return Promise.resolve([getAddress(wallet)]);
  },

  getDefaultAccount(): Promise<string> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_ACCOUNT');
    }

    return Promise.resolve(getAddress(wallet));
  },

  getPublicKey(account: string): Promise<string> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_ACCOUNT');
    }

    const pk = getAddressPk(wallet, account);

    if (pk === undefined) {
      return Promise.reject('WRONG_ACCOUNT');
    } else {
      return Promise.resolve(pk);
    }
  },

  async makeTransfer(sender: string, recipient: string, asset: Asset, amount: number): Promise<string> {
    const accounts = await assetApi.getOwnAccounts();
    if (!accounts.includes(sender)) {
      throw new Error('WRONG_SENDER');
    }

    return await getRequestsManager().initTransfer({recipient, asset, amount});
  }
}
