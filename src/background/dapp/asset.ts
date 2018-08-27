import { Asset, AssetApi } from 'ontology-dapi';
import { getAddress } from '../../api/accountApi';
import { getStore } from '../redux';
import { getRequestsManager } from '../requestsManager';

export const assetApi: AssetApi = {
  getDefaultAccount(): Promise<string> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_ACCOUNT');
    }

    return Promise.resolve(getAddress(wallet));
  },

  async makeTransfer(recipient: string, asset: Asset, amount: number): Promise<string> {
    return await getRequestsManager().initTransfer({recipient, asset, amount});
  }
}
