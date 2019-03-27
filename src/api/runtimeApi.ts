import axios from "axios";
import { get } from "lodash";
import { CONST, Crypto, OntAssetTxBuilder, TransactionBuilder, WebsocketClient } from "ontology-ts-sdk";
import { decryptWallet, getWallet } from "./authApi";
import Address = Crypto.Address;
import { getClient } from "../network";
import { getAccount } from "./accountApi";

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

// TODO: use Ws
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

  const tx = OntAssetTxBuilder.makeTransferTx(asset, from, to, amount, "500", `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  // tslint:disable-next-line:no-console
  console.log("tx", tx);
  const protocol = ssl ? "wss" : "ws";
  const socketClient = new WebsocketClient(`${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`, true);
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

  const tx = OntAssetTxBuilder.makeWithdrawOngTx(from, from, String(amount), from, "500", `${CONST.DEFAULT_GAS_LIMIT}`);
  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const protocol = ssl ? "wss" : "ws";
  const socketClient = new WebsocketClient(`${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`);
  await socketClient.sendRawTransaction(tx.serialize(), false, true);
}
