/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import { get } from 'lodash';
import {
  CONST,
  Crypto,
  Identity,
  OntAssetTxBuilder,
  OntidContract,
  TransactionBuilder,
  TxSignature,
} from 'ontology-ts-sdk';
import { decryptAccount, getAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { decryptIdentity } from '../../api/identityApi';
import { RegisterOntIdRequest, TransferRequest, WithdrawOngRequest } from '../../redux/transactionRequests';
import Address = Crypto.Address;
import { getClient, getNodeAddress } from '../network';
import { getStore } from '../redux';

export async function getBalance() {
  const state = getStore().getState();
  const address = getAccount(state.wallet.wallet!).address;

  const client = getClient();
  const response = await client.getBalance(address);
  const ont: number = Number(get(response, 'Result.ont'));
  const ong: number = Number(get(response, 'Result.ong'));

  return {
    ong,
    ont,
  };
}

export async function getUnboundOng() {
  const state = getStore().getState();
  const address = getAccount(state.wallet.wallet!).address;

  const client = getClient();
  const response = await client.getUnboundong(address);
  const unboundOng = Number(get(response, 'Result'));
  return unboundOng;
}

export async function transfer(request: TransferRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = getAccount(state.wallet.wallet!).address;
  const privateKey = decryptAccount(wallet, password);

  const to = new Address(request.recipient);
  const amount = request.amount;

  const tx = OntAssetTxBuilder.makeTransferTx(request.asset, from, to, amount, '2500', `${CONST.DEFAULT_GAS_LIMIT}`);

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function withdrawOng(request: WithdrawOngRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = getAccount(state.wallet.wallet!).address;
  const privateKey = decryptAccount(wallet, password);

  const amount = request.amount;

  const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, from, amount, from, '2500', `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function registerOntId(request: RegisterOntIdRequest, password: string) {
  // const accountPassword: string = request.password;
  const accountPassword: string = password;
  const identityEncoded: string = request.identity;
  const identity = Identity.parseJson(identityEncoded);

  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = getAccount(state.wallet.wallet!).address;
  const accountPrivateKey = decryptAccount(wallet, accountPassword);
  const identityPrivateKey = decryptIdentity(identity, request.password, wallet.scrypt);

  const identityPublicKey = identityPrivateKey.getPublicKey();

  const tx = OntidContract.buildRegisterOntidTx(identity.ontid, identityPublicKey, '2500', `${CONST.DEFAULT_GAS_LIMIT}`);

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

  // be compatible with ONTID 2.0 api
  const restUrl = 'http://' + getNodeAddress() + ':20334';
  let document 
  try {
    document = await OntidContract.getDocumentJson(ontId, restUrl);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
  }
  
  let idOnchain;
  if (document && document.publicKey) {
    idOnchain = document.publicKey.find(item => item.id.split('#')[0] === ontId)
  }
  if (idOnchain) {
    return true;
  } else {
    const tx = OntidContract.buildGetDDOTx(ontId);

    const client = getClient();
    const result = await client.sendRawTransaction(tx.serialize(), true, false);

    if (result.Result.Result === '') {
      return false;
    }

    // fixme: get DDO and check if public key of the identity is pressent
    return true;
  }
}
