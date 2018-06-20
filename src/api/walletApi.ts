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
import { CONST, Crypto, OntAssetTxBuilder, RestClient, TransactionBuilder, WebsocketClient } from 'ont-sdk-ts';
import { decryptWallet, getWallet } from './authApi';
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

  if (asset === 'ONG') {
    amount = String(Number(amount) * 1000000000);
  }

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
