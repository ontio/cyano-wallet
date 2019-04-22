import { getClient } from "../network";
import { get } from "lodash";
import { TransactionBuilder, Parameter, ParameterType, utils, CONST, Crypto } from "ontology-ts-sdk";
import * as Long from "long";
import { getWallet } from "./authApi";
import { getAccount, decryptAccount } from "./accountApi";

export async function exchangeOnyx(amount: number, contract: string, walletEncoded: any, password: string) {
  const funcName = "Buy";
  const wallet = getWallet(walletEncoded);
  let address = getAccount(wallet).address.toHexString();
  address = utils.reverseHex(address);
  const client = getClient();
  const privateKey = decryptAccount(wallet, password);
  console.log("exchangeOnyx", { amount, contract });

  const p1 = new Parameter("amount", ParameterType.Int, amount);
  const p2 = new Parameter("address", ParameterType.ByteArray, address);

  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [p1, p2],
    new Crypto.Address(utils.reverseHex(contract)),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`,
    new Crypto.Address(address)
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  await client.sendRawTransaction(tx.serialize(), false, true);
}

/**
 * @param  {string} contract - smart contrat's address
 */
export async function getOxgExhangeRate(contract: string) {
  const client = getClient();
  const funcName = "GetBuyRate";

  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [],
    new Crypto.Address(utils.reverseHex(contract)),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`
  );

  try {
    const response = await client.sendRawTransaction(tx.serialize(), true);
    const data = get(response, "Result.Result", "");
    const rate = Long.fromString(utils.reverseHex(data), true, 16).toString();
    console.log("response:", rate);

    return rate;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function prepareInt(num) {
  return Math.round(num * 100000000);
}
