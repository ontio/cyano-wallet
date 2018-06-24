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
import axios from 'axios';
import { get } from 'lodash';
import { CONST, Crypto, OntAssetTxBuilder, RestClient, TransactionBuilder, WebsocketClient } from 'ont-sdk-ts';
import { decryptWallet, getWallet } from './authApi';
import Address = Crypto.Address;

export async function getBalance(nodeAddress: string, walletEncoded: any) {
  const wallet = getWallet(walletEncoded);

  const restClient = new RestClient(`http://${nodeAddress}:${CONST.HTTP_REST_PORT}`);
  const response = await restClient.getBalance(wallet.accounts[0].address);
  const ont: number = Number(get(response, 'Result.ont'));
  const ong: number = Number(get(response, 'Result.ong'));

  return {
    ong,
    ont
  };
}

/**
 * todo: change to unboundong url when 0.9 is pushed to testnet
 */
export async function getUnboundOng(nodeAddress: string, walletEncoded: any) {
  const wallet = getWallet(walletEncoded);

  const baseUrl = `http://${nodeAddress}:${CONST.HTTP_REST_PORT}`;
  const unboundOngUrl = '/api/v1/unclaimong/';
  const address = wallet.accounts[0].address;

  const url = baseUrl + unboundOngUrl + address.toBase58();
  const response = await axios.get(url).then((res) => {
            return res.data;
        });

  const unboundOng: number = Number(get(response, 'Result'));
  return unboundOng;
}


export async function transfer(nodeAddress: string, walletEncoded: any, password: string, recipient: string, asset: 'ONT' | 'ONG', amount: string) {
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
  await TransactionBuilder.signTransaction(tx, privateKey);

  const socketClient = new WebsocketClient(`ws://${nodeAddress}:${CONST.HTTP_WS_PORT}`);
  await socketClient.sendRawTransaction(tx.serialize(), false, true);
}

/**
 * todo: change to withdrawOng method when 0.9 is pushed to testnet
 */
export async function withdrawOng(nodeAddress: string, walletEncoded: any, password: string, amount: string) {
  const wallet = getWallet(walletEncoded);
  const from = wallet.accounts[0].address;
  const privateKey = decryptWallet(wallet, password);

  amount = String(Number(amount) * 1000000000);

  const tx = OntAssetTxBuilder.makeClaimOngTx(
    from, 
    from, 
    String(amount), 
    from, 
    '0', 
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  await TransactionBuilder.signTransaction(tx, privateKey);

  const socketClient = new WebsocketClient(`ws://${nodeAddress}:${CONST.HTTP_WS_PORT}`);
  await socketClient.sendRawTransaction(tx.serialize(), false, true);
}
