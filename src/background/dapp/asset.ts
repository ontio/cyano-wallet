import { Asset } from 'ontology-dapi';
import { getAddress } from '../../api/accountApi';
import { popupManager } from '../popUpManager';
import { getStore } from '../redux';

/**
 * Gets own accounts.
 * This wallet supports only one account
 */
export function getOwnAccounts(): Promise<string[]> {
  const state = getStore().getState();
  const wallet = state.wallet.wallet;

  if (wallet === null) {
    return Promise.resolve([]);
  }

  return Promise.resolve([getAddress(wallet)]);
}

export function getDefaultAccount(): Promise<string | null> {
  const state = getStore().getState();
  const wallet = state.wallet.wallet;

  if (wallet === null) {
    return Promise.resolve(null);
  }

  return Promise.resolve(getAddress(wallet));
}

export async function makeTransfer(sender: string, recipient: string, asset: Asset, amount: number): Promise<void> {
  
  await popupManager.show();

  return await popupManager.callMethod('init_transfer', recipient, asset, amount);
}
