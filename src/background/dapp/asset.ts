import { Asset } from 'ontology-dapi';
import { getAddress } from '../../api/accountApi';
import { sendMessageToPopup, showPopup } from '../popUpManager';
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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * fixme: wait for popup to open and then send the request
 * fixme: resolve/reject the request based on the transfer outcome
 */
export async function makeTransfer(sender: string, recipient: string, asset: Asset, amount: number): Promise<void> {
  await showPopup();
  
  await sleep(5000);

  const response = await sendMessageToPopup({
    amount,
    asset,
    operation: 'init_transfer',
    recipient,
    sender
  });

  console.log('response from popup: ', response);
  // const url = browser.runtime.getURL('popup.html');
  // browser.tabs.create({ url });

  // window.open("popup.html", "extension_popup", "width=350,height=430,status=no,scrollbars=yes,resizable=no");
  // return Promise.reject('Not supported yet.');
}
