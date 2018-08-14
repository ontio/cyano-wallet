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
import { get } from 'lodash';
import { CONST, Crypto, Identity, OntAssetTxBuilder, OntidContract, TransactionBuilder, TxSignature } from 'ontology-ts-sdk';
import { decryptAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { decryptIdentity } from '../../api/identityApi';
import { AssetType } from '../../redux/runtime';
import Address = Crypto.Address;
import { getClient } from '../network';
import { getStore } from '../redux';

export async function getBalance() {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const client = getClient();
  const response = await client.getBalance(wallet.accounts[0].address);
  const ont: number = Number(get(response, 'Result.ont'));
  const ong: number = Number(get(response, 'Result.ong'));

  return {
    ong,
    ont
  };
}

export async function getUnboundOng() {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const client = getClient();
  const response = await client.getUnboundong(wallet.accounts[0].address);
  const unboundOng = Number(get(response, 'Result'));
  return unboundOng;
}

export async function transfer(password: string, recipient: string, asset: AssetType, amount: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = wallet.accounts[0].address;
  const privateKey = decryptAccount(wallet, password);

  const to = new Address(recipient);

  if (asset === 'ONG') {
    amount = String(Number(amount) * 1000000000);
  }

  const tx = OntAssetTxBuilder.makeTransferTx(
    asset,
    from,
    to,
    amount,
    '500',
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function withdrawOng(password: string, amount: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = wallet.accounts[0].address;
  const privateKey = decryptAccount(wallet, password);

  amount = String(Number(amount) * 1000000000);

  const tx = OntAssetTxBuilder.makeWithdrawOngTx(
    from, 
    from, 
    String(amount), 
    from, 
    '500', 
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function registerOntId(identity: Identity, password: string, accountPassword: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = wallet.accounts[0].address;
  const accountPrivateKey = decryptAccount(wallet, accountPassword);
  const identityPrivateKey = decryptIdentity(identity, password, wallet.scrypt);

  const identityPublicKey = identityPrivateKey.getPublicKey();

  const tx = OntidContract.buildRegisterOntidTx(
    identity.ontid, 
    identityPublicKey, 
    '500', 
    `${CONST.DEFAULT_GAS_LIMIT}`
  );

  tx.payer = from;
  await TransactionBuilder.signTransactionAsync(tx, accountPrivateKey);

  // signs by identity private key
  const signature = await TxSignature.createAsync(tx, identityPrivateKey);
  tx.sigs.push(signature);

  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function checkOntId(identity: Identity, password: string) {
  const ontId = identity.ontid;
  
  const tx = OntidContract.buildGetDDOTx(ontId);

  const client = getClient();
  const result = await client.sendRawTransaction(tx.serialize(), true, false);

  if (result.Result.Result === '') {
    return false;
  }
  
  // fixme: get DDO and check if public key of the identity is pressent
  return true;
}
