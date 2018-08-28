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
import { RegisterOntIdRequest, TransferRequest, WithdrawOngRequest } from '../../redux/transactionRequests';
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

export async function transfer(request: TransferRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = wallet.accounts[0].address;
  const privateKey = decryptAccount(wallet, password);

  const to = new Address(request.recipient);
  const amount = String(request.amount);

  const tx = OntAssetTxBuilder.makeTransferTx(
    request.asset,
    from,
    to,
    amount,
    '500',
    `${CONST.DEFAULT_GAS_LIMIT}`
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function withdrawOng(request: WithdrawOngRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = wallet.accounts[0].address;
  const privateKey = decryptAccount(wallet, password);

  const amount = String(request.amount);

  const tx = OntAssetTxBuilder.makeWithdrawOngTx(
    from, 
    from, 
    amount, 
    from, 
    '500', 
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function registerOntId(request: RegisterOntIdRequest, password: string) {
  const accountPassword: string = request.password;
  const identityEncoded: string = request.identity;
  const identity = Identity.parseJson(identityEncoded);
  
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
