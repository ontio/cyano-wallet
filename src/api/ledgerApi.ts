/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as Ledger from '@ont-community/ontology-ts-sdk-ledger';
import { Account, Wallet } from 'ontology-ts-sdk';
import { v4 as uuid } from 'uuid';
import { storageSet } from './storageApi';

export async function isLedgerSupported() {
  return await Ledger.isLedgerSupported();
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
  
    const privateKey = await Ledger.create(index, false);
    // const publicKey = privateKey.getPublicKey();
  
    // const identity = Identity.create(privateKey, '', uuid(), scryptParams);
    // const ontId = identity.ontid;
  
    // register the ONYX ID on blockchain
    // if (register) {
    //   const tx = OntidContract.buildRegisterOntidTx(ontId, publicKey, '0', '30000');
    //   tx.payer = identity.controls[0].address;
      
    //   await TransactionBuilder.signTransactionAsync(tx, privateKey);
  
    //   const protocol = ssl ? 'wss' : 'ws';
    //   const client = new WebsocketClient(`${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`, true);
    //   await client.sendRawTransaction(tx.serialize(), false, true);
    // }
  
    const account = Account.create(privateKey, '', uuid(), scryptParams);
  
    // wallet.addIdentity(identity);
    wallet.addAccount(account);
    // wallet.setDefaultIdentity(identity.ontid);
    wallet.setDefaultAccount(account.address.toBase58());
  
    await storageSet('wallet', wallet.toJson());
  
    return {
      wallet: wallet.toJson()
    };
  }
  
  export function isLedgerKey(wallet: Wallet) {
    return wallet.accounts[0].encryptedKey;
  }
  