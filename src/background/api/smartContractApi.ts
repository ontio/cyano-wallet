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
import { Parameter } from 'ontology-dapi';
import { Crypto, Transaction, TransactionBuilder, utils } from 'ontology-ts-sdk';
import { buildInvokePayload } from 'ontology-ts-test';
import { decryptAccount, getAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { ScCallReadRequest, ScCallRequest, ScDeployRequest } from '../../redux/transactionRequests';
import { getClient } from '../network';
import { getStore } from '../redux';

import Address = Crypto.Address;
import {decryptDefaultIdentity } from 'src/api/identityApi';

/**
 * Creates, signs and sends the transaction for Smart Contract call.
 * 
 * Can work in two modes:
 * 1. simple account sign (requireIdentity = false)
 *  - the transaction is created, signed and sent in one step
 * 2. account + identity sign (requireIdentity = true)
 *  - the transaction is created, signed by account and stored in first step (presignedTransaction = undefined)
 *  - signed by identity and sent in second step (presignedTransaction = serialized transaction)
 * 
 * @param request request describing the SC call
 * @param password password to decode the private key (account or identity)
 */
export async function scCall(request: ScCallRequest, password: string): Promise<string | any> {
  request.parameters = request.parameters !== undefined ? request.parameters : [];
  request.gasPrice = request.gasPrice !== undefined ? request.gasPrice : 500;
  request.gasLimit = request.gasLimit !== undefined ? request.gasLimit : 30000;

  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);
  const account = getAccount(state.wallet.wallet!).address;
  
  let tx: Transaction;
  if (request.presignedTransaction) {
    tx = Transaction.deserialize(request.presignedTransaction);
  } else {
    // convert params
    const params = convertParams(request.parameters);
    const payload = buildInvokePayload(request.contract, request.method, params);
  
    tx = TransactionBuilder.makeInvokeTransaction(
      request.method,
      [],
      new Address(utils.reverseHex(request.contract)),
      String(request.gasPrice),
      String(request.gasLimit),
      account,
    );

    (tx.payload as any).code = payload.toString('hex');
  }

  let privateKey: Crypto.PrivateKey;
  if (request.requireIdentity && request.presignedTransaction) {
    // mode 2, step 2: 
    // already signed by account
    // do signature by identity
    privateKey = decryptDefaultIdentity(wallet, password, wallet.scrypt);

    // fixme: add support for async sign
    TransactionBuilder.addSign(tx, privateKey);
  } else {
    // mode 1 or mode 2, step 1:
    // do signature by account
    privateKey = decryptAccount(wallet, password);
    await TransactionBuilder.signTransactionAsync(tx, privateKey);
  }

  if (request.requireIdentity && !request.presignedTransaction) {
    // mode 2, step 1
    // return the presigned transaction to be stored in request
    // outside of this method
    return tx.serialize();

  } else {
    // mode 1 or mode 2, step 2
    const client = getClient();
    return await client.sendRawTransaction(tx.serialize(), false, true);
  }
}

export async function scCallRead(request: ScCallReadRequest) {
  request.parameters = request.parameters !== undefined ? request.parameters : [];

  // convert params
  const params = convertParams(request.parameters);
  const payload = buildInvokePayload(request.contract, request.method, params);

  const tx = TransactionBuilder.makeInvokeTransaction(
    request.method,
    [],
    new Address(utils.reverseHex(request.contract)),
  );

  (tx.payload as any).code = payload.toString('hex');

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), true, false);
}

export async function scDeploy(request: ScDeployRequest, password: string) {
  request.gasPrice = request.gasPrice !== undefined ? request.gasPrice : 500;
  request.gasLimit = request.gasLimit !== undefined ? request.gasLimit : 30000;

  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const account = getAccount(state.wallet.wallet!).address;
  const privateKey = decryptAccount(wallet, password);

  const tx = TransactionBuilder.makeDeployCodeTransaction(
    request.code,
    request.name,
    request.version,
    request.author,
    request.email,
    request.description,
    request.needStorage,
    String(request.gasPrice),
    String(request.gasLimit),
    account,
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
}

function convertParams(parameters?: Parameter[]): any[] {
  if (parameters === undefined) {
    return [];
  }

  return parameters.map((p) => convertParam(p));
}

function convertMapParams(map: any) {
  const obj = {};
  for (const prop in map) {
    if (map.hasOwnProperty(prop)) {
      obj[prop] = convertParam(map[prop]);
    }
  }

  return obj;
}

function convertParam(parameter: Parameter) {
  if (parameter.type === 'Boolean') {
    return parameter.value === true || parameter.value === 'true';
  } else if (parameter.type === 'Integer') {
    return Number(parameter.value);
  } else if (parameter.type === 'ByteArray') {
    return new Buffer(parameter.value, 'hex');
  } else if (parameter.type === 'String') {
    return parameter.value;
  } else if (parameter.type === 'Array') {
    return convertParams(parameter.value);
  } else if (parameter.type === 'Map') {
    return convertMapParams(parameter.value);
  } else {
    // send as is, so underlying library can process it
    return parameter.value;
  }
}
