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
import axios from "axios";
import { get } from "lodash";
import {
  CONST,
  Crypto,
  OntAssetTxBuilder,
  RestClient,
  TransactionBuilder,
  WebsocketClient
} from "ontology-ts-sdk";
import { decryptWallet, getWallet } from "./authApi";
import Address = Crypto.Address;

export async function getBalance(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any
) {
  const wallet = getWallet(walletEncoded);

  const protocol = ssl ? "https" : "http";
  const restClient = new RestClient(
    `${protocol}://${nodeAddress}:${CONST.HTTP_REST_PORT}`
  );
  const response = await restClient.getBalance(wallet.accounts[0].address);

  const onyx: number = Number(get(response, "Result.onyx"));
  const oxg: number = Number(get(response, "Result.oxg"));

  return {
    onyx,
    oxg
  };
}

export async function getUnboundOxg(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any
) {
  const wallet = getWallet(walletEncoded);

  const protocol = ssl ? "https" : "http";
  const baseUrl = `${protocol}://${nodeAddress}:${CONST.HTTP_REST_PORT}`;
  const unboundOngUrl = "/api/v1/unboundoxg/";
  const address = wallet.accounts[0].address;

  const url = baseUrl + unboundOngUrl + address.toBase58();
  const response = await axios.get(url).then(res => {
    return res.data;
  });

  const unboundOng: number = Number(get(response, "Result"));
  return unboundOng;
}

export async function transfer(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any,
  password: string,
  recipient: string,
  asset: "ONYX" | "OXG",
  amount: string
) {
  const wallet = getWallet(walletEncoded);
  const from = wallet.accounts[0].address;
  const privateKey = decryptWallet(wallet, password);
  // tslint:disable-next-line:no-console
  console.log("private key", privateKey);
  const to = new Address(recipient);

  if (asset === "OXG") {
    amount = String(Number(amount) * 1000000000);
  }

  const tx = OntAssetTxBuilder.makeTransferTx(
    asset,
    from,
    to,
    amount,
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  // tslint:disable-next-line:no-console
  console.log("tx", tx);
  const protocol = ssl ? "wss" : "ws";
  const socketClient = new WebsocketClient(
    `${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`,
    true
  );
  await socketClient.sendRawTransaction(tx.serialize(), false, true);
}

export async function withdrawOng(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any,
  password: string,
  amount: string
) {
  const wallet = getWallet(walletEncoded);
  const from = wallet.accounts[0].address;
  const privateKey = decryptWallet(wallet, password);

  amount = String(Number(amount) * 1000000000);

  const tx = OntAssetTxBuilder.makeWithdrawOngTx(
    from,
    from,
    String(amount),
    from,
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const protocol = ssl ? "wss" : "ws";
  const socketClient = new WebsocketClient(
    `${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`
  );
  await socketClient.sendRawTransaction(tx.serialize(), false, true);
}
