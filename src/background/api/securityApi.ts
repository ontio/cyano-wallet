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

import { Crypto, Parameter, ParameterType, TransactionBuilder, utils } from 'ontology-ts-sdk';
import { decryptAccount, getAccount} from 'src/api/accountApi';
import { getWallet } from 'src/api/authApi';
import { ENHANCE_SECURITY_BACKEND_MAP, request as sendRequest } from 'src/api/securityApi';
import { EnhanceSecurityRequest } from 'src/redux/transactionRequests';
import { getStore } from '../redux';

import Address = Crypto.Address;

export async function enhanceSecurity(request: EnhanceSecurityRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);
  const account = getAccount(state.wallet.wallet!).address;

  const gasPrice = '2500';
  const gasLimit = '1000000';
  const tx = TransactionBuilder.makeWasmVmInvokeTransaction(
    request.method,
    [new Parameter('', ParameterType.Address, account)],
    new Address(utils.reverseHex(request.contract)),
    gasPrice,
    gasLimit,
    new Address(request.payer),
  );

  const privateKey: Crypto.PrivateKey = decryptAccount(wallet, password);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const txHex = tx.serialize();

  const baseURL = ENHANCE_SECURITY_BACKEND_MAP[request.net];
  if (!baseURL) {
    return;
  }

  await sendRequest({
    baseURL,
    data: { txHex },
    method: 'post',
    url: '/common/cancel-approval',
  });
}
