import { AssetApi } from '@ont-dev/ontology-dapi';
import { getAddress, getPublicKey } from '../../api/accountApi';
import { encodeAmount } from '../../popup/utils/number';
import { getStore } from '../redux';
import { getRequestsManager } from '../requestsManager';

export const assetApi: AssetApi = {
  getAccount(): Promise<string> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_ACCOUNT');
    }

    return Promise.resolve(getAddress(wallet));
  },

  getPublicKey(): Promise<string> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_ACCOUNT');
    }

    return Promise.resolve(getPublicKey(wallet));
  },

  async send({ to, asset, amount }): Promise<string> {
    return await getRequestsManager().initTransfer({ recipient: to, asset, amount: encodeAmount(amount, 9) });
  },

  async sendV2({ to, asset, amount }): Promise<string> {
    return await getRequestsManager().initTransfer({ recipient: to, asset, amount });
  },
};
