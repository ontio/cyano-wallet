import { get } from 'lodash';
import { Account, CONST, Identity, Ledger, OntidContract, Wallet, WebsocketClient } from 'ont-sdk-ts';
import LedgerKey = Ledger.LedgerKey;
import { v4 as uuid } from 'uuid';
import { sendToChannel } from './iframeApi';
import { storageSet } from './storageApi';
import { signTransaction } from './walletApi';

export async function isLedgerSupported() {
  try {
    const response = await sendToChannel({ id: uuid(), method: 'isLedgerSupported' });
    return get(response, 'result') as boolean;
  } catch (e) {
    return false;
  }
}

export async function importLedgerKey(nodeAddress: string, ssl: boolean, index: number, register: boolean) {
    const wallet = Wallet.create(uuid());
    const scrypt = wallet.scrypt;
    const scryptParams = {
      blockSize: scrypt.r,
      cost: scrypt.n,
      parallel: scrypt.p,
      size: scrypt.dkLen
    };
  
    const response = await sendToChannel({ id: uuid(), method: 'ledgerKeyCreate', index });
    const privateKey = new LedgerKey(index, get(response, 'result') as string);
    const publicKey = privateKey.getPublicKey();
  
  
    const identity = Identity.create(privateKey, '', uuid(), scryptParams);
    const ontId = identity.ontid;
  
    // register the ONT ID on blockchain
    if (register) {
      let tx = OntidContract.buildRegisterOntidTx(ontId, publicKey, '0', '30000');
      tx.payer = identity.controls[0].address;
      
      tx = await signTransaction(tx, privateKey);
  
      const protocol = ssl ? 'wss' : 'ws';
      const client = new WebsocketClient(`${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`, true);
      await client.sendRawTransaction(tx.serialize(), false, true);
    }
  
    const account = Account.create(privateKey, '', uuid(), scryptParams);
  
    wallet.addIdentity(identity);
    wallet.addAccount(account);
    wallet.setDefaultIdentity(identity.ontid);
    wallet.setDefaultAccount(account.address.toBase58());
  
    await storageSet('wallet', wallet.toJson());
  
    return {
      wallet: wallet.toJson()
    };
  }
  
  export function isLedgerKey(wallet: Wallet) {
    return wallet.accounts[0].encryptedKey instanceof LedgerKey;
  }
  