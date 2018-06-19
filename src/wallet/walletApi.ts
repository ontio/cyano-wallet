import { get } from 'lodash';
import { CONST, Crypto, OntAssetTxBuilder, RestClient, TransactionBuilder, WebsocketClient } from 'ont-sdk-ts';
import { decryptWallet, getWallet } from '../auth/authApi';
import Address = Crypto.Address;

const socketClient = new WebsocketClient();
const restClient = new RestClient();

export async function getBalance(walletEncoded: any) {
  const wallet = getWallet(walletEncoded);

  const response = await restClient.getBalance(wallet.accounts[0].address);
  const ont: number = get(response, 'Result.ont');
  const ong: number = get(response, 'Result.ong');

  return {
    ong,
    ont
  };
}

export async function transfer(walletEncoded: any, password: string, recipient: string, asset: 'ONT' | 'ONG', amount: string) {
  const wallet = getWallet(walletEncoded);
  const from = wallet.accounts[0].address;
  const privateKey = decryptWallet(wallet, password);
  
  const to = new Address(recipient);

  const tx = OntAssetTxBuilder.makeTransferTx(
    asset,
    from,
    to,
    amount,
    '0',
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  TransactionBuilder.signTransaction(tx, privateKey);
  await socketClient.sendRawTransaction(tx.serialize(), false, true);
}
