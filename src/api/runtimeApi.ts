import axios from "axios";
import { get } from "lodash";
import { CONST, Crypto, OntAssetTxBuilder, TransactionBuilder } from "ontology-ts-sdk";
import { getWallet } from "./authApi";
import Address = Crypto.Address;
import { getClient } from "../network";
import { getAccount, decryptAccount } from "./accountApi";

export async function getBalance(walletEncoded: any) {
  const wallet = getWallet(walletEncoded);
  const address = getAccount(wallet).address;
  const client = getClient();
  const response = await client.getBalance(address);

  const onyx: number = Number(get(response, "Result.onyx"));
  const oxg: number = Number(get(response, "Result.oxg"));

  return {
    onyx,
    oxg
  };
}

/* 
  TODO:
  fix getUnboundong in wsProvider
  use Ws
*/
export async function getUnboundOxg(nodeAddress: string, ssl: boolean, walletEncoded: any) {
  const wallet = getWallet(walletEncoded);
  const address = getAccount(wallet).address;
  const protocol = ssl ? "https" : "http";
  const baseUrl = `${protocol}://${nodeAddress}:${CONST.HTTP_REST_PORT}`;
  const unboundOngUrl = "/api/v1/unboundoxg/";

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
  const from = getAccount(wallet).address;
  const privateKey = decryptAccount(wallet, password);
  // tslint:disable-next-line:no-console
  console.log("from: ", from);
  const to = new Address(recipient);

  const tx = OntAssetTxBuilder.makeTransferTx(asset, from, to, String(amount), "500", `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  // tslint:disable-next-line:no-console
  console.log("transfer tx", tx);
  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function withdrawOng(
  nodeAddress: string,
  ssl: boolean,
  walletEncoded: any,
  password: string,
  amount: string
) {
  const wallet = getWallet(walletEncoded);
  const from = getAccount(wallet).address;
  const privateKey = decryptAccount(wallet, password);
  const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, from, String(amount), from, "500", `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);
  console.log("withdrawOng tx", tx);
  const client = getClient();
  await client.sendRawTransaction(tx.serialize(), false, true);
}
