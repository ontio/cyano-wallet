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
import { Parameter } from '@ont-dev/ontology-dapi';
import { Crypto, OntfsContractTxBuilder, Parameter as Param, ParameterType, Transaction, TransactionBuilder, utils } from 'ontology-ts-sdk';
import { decryptAccount, getAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { FsCallRequest, ScCallReadRequest, ScCallRequest, ScDeployRequest } from '../../redux/transactionRequests';
import { getClient } from '../network';
import { getStore } from '../redux';

import Address = Crypto.Address;
import { decryptDefaultIdentity } from 'src/api/identityApi';

export async function fsCall(request: FsCallRequest, password: string): Promise<string | any> {
  const { parameters = [], gasPrice = 500, gasLimit = 30000, method, paramsHash } = request;

  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);
  const account = getAccount(state.wallet.wallet!).address;

  let tx: Transaction;
  if (request.presignedTransaction) {
    tx = Transaction.deserialize(request.presignedTransaction);
  } else if (paramsHash) {
    tx = OntfsContractTxBuilder.buildTxByParamsHash(
      method,
      paramsHash,
      String(gasPrice),
      String(gasLimit),
      account
    );
  } else {
    switch(method) {
      case 'fsStoreFiles': {
        tx = OntfsContractTxBuilder.buildStoreFilesTx(
          parameters.filesInfo,
          parameters.fileOwner,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      case 'fsChallenge': {
        tx = OntfsContractTxBuilder.buildChallengeTx(
          parameters.fileHash,
          parameters.fileOnwer,
          parameters.nodeAddr,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      case 'fsTransferFiles': {
        tx = OntfsContractTxBuilder.buildTransferFilesTx(
          parameters.fileTransfers,
          parameters.originOwner,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      case 'fsRenewFiles': {
        tx = OntfsContractTxBuilder.buildRenewFilesTx(
          parameters.filesRenew,
          parameters.newFileOwner,
          parameters.newPayer,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      case 'fsDeleteFiles': {
        tx = OntfsContractTxBuilder.buildDeleteFilesTx(
          parameters.fileHashes,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      case 'fsReadFilePledge': {
        tx = OntfsContractTxBuilder.buildFileReadPledgeTx(
          parameters.fileHash,
          parameters.readPlans,
          parameters.downloader,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      case 'fsCancelFileRead': {
        tx = OntfsContractTxBuilder.buildCancelFileReadTx(
          parameters.fileHash,
          parameters.downloader,
          String(gasPrice),
          String(gasLimit),
          account
        );
        break;
      }
      default: {
        throw new Error(`Fs method ${method} not supported.`);
      }
    }
  }

  const privateKey = decryptAccount(wallet, password);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  if (!request.presignedTransaction) {
    return tx.serialize();
  } else {
    const client = getClient();
    return await client.sendRawTransaction(tx.serialize(), false, true);
  }
}

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
    /* 
    * we use ontology-ts-sdk to build the transaction
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
     */
    if (request.isWasmVm) {
      tx = TransactionBuilder.makeWasmVmInvokeTransaction(
        request.method,
        params,
        new Address(utils.reverseHex(request.contract)),
        String(request.gasPrice),
        String(request.gasLimit),
        account,
      );
    } else {
      tx = TransactionBuilder.makeInvokeTransaction(
        request.method,
        params,
        new Address(utils.reverseHex(request.contract)),
        String(request.gasPrice),
        String(request.gasLimit),
        account,
      );
    }
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
  const gasPrice = '500';
  const gasLimit = '30000';
  // convert params
  const params = convertParams(request.parameters);
  /* 
  const payload = buildInvokePayload(request.contract, request.method, params);
  const tx = TransactionBuilder.makeInvokeTransaction(
    request.method,
    [],
    new Address(utils.reverseHex(request.contract)),
  );
  (tx.payload as any).code = payload.toString('hex');
   */
  let tx: Transaction;
  if (request.isWasmVm) {
    tx = TransactionBuilder.makeWasmVmInvokeTransaction(
      request.method,
      params,
      new Address(utils.reverseHex(request.contract)),
      gasPrice,
      gasLimit,
    );
  } else {
    tx = TransactionBuilder.makeInvokeTransaction(
      request.method,
      params,
      new Address(utils.reverseHex(request.contract)),
      gasPrice,
      gasLimit,
    );
  }
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
    request.vmType,
    String(request.gasPrice),
    String(request.gasLimit),
    account,
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
}

function convertParams(parameters?: Parameter[]): Param[] {
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

function convertParam(parameter: Parameter): Param {
  if (parameter.type === 'Boolean') {
    return new Param('', ParameterType.Boolean, parameter.value === true || parameter.value === 'true');
  } else if (parameter.type === 'Integer') {
    return new Param('', ParameterType.Integer, Number(parameter.value));
  } else if (parameter.type === 'ByteArray') {
    // return new Buffer(parameter.value, 'hex');
    // return parameter.value;
    // will use ontology-ts-sdk to build script code and it treats ByteArray as hex string;
    return new Param('', ParameterType.ByteArray, parameter.value);
  } else if (parameter.type === 'String') {
    return new Param('', ParameterType.String, parameter.value)
  } else if (parameter.type === 'Long') {
    return new Param('', ParameterType.Long, parameter.value)
  } else if (parameter.type === 'Array') {
    return new Param('', ParameterType.Array, convertParams(parameter.value));
  } else if (parameter.type === 'Map') {
    return new Param('', ParameterType.Map, convertMapParams(parameter.value));
  } else if (parameter.type === 'Address') {
    return new Param('', ParameterType.Address, new Address(parameter.value));
  } else {
    // send as is, so underlying library can process it
    return parameter.value;
  }
}
