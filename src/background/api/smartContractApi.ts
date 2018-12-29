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
import { Crypto, TransactionBuilder, utils } from 'ontology-ts-sdk';
import { buildInvokePayload } from 'ontology-ts-test';
import { decryptAccount, getAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { ScCallReadRequest, ScCallRequest, ScDeployRequest } from '../../redux/transactionRequests';
import { getClient } from '../network';
import { getStore } from '../redux';

import Address = Crypto.Address;

export async function scCall(request: ScCallRequest, password: string) {
  request.parameters = request.parameters !== undefined ? request.parameters : [];
  request.gasPrice = request.gasPrice !== undefined ? request.gasPrice : 500;
  request.gasLimit = request.gasLimit !== undefined ? request.gasLimit : 30000;

  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const account = getAccount(state.wallet.wallet!).address;
  const privateKey = decryptAccount(wallet, password);

  // convert params
  const params = convertParams(request.parameters);
  const payload = buildInvokePayload(request.contract, request.method, params);

  const tx = TransactionBuilder.makeInvokeTransaction(
    request.method,
    [],
    new Address(utils.reverseHex(request.contract)),
    String(request.gasPrice),
    String(request.gasLimit),
    account,
  );

  (tx.payload as any).code = payload.toString('hex');

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
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
