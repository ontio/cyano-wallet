import { Asset, AssetApi } from 'ontology-dapi';
import { getAddress, getAddressPk } from '../../api/accountApi';
import { popupManager } from '../popUpManager';
import { getStore } from '../redux';

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

  async makeTransfer(sender: string, recipient: string, asset: Asset, amount: number): Promise<void> {
    const accounts = await assetApi.getOwnAccounts();
    if (!accounts.includes(sender)) {
      throw new Error('WRONG_SENDER');
    }

    await popupManager.show();

    return await popupManager.callMethod('init_transfer', recipient, asset, amount);
  }
}
