import { getClient } from "../network";
import { get } from "lodash";
import {
  Transaction,
  TransactionBuilder,
  ParameterType,
  utils,
  CONST,
  Crypto
} from "ontology-ts-sdk";
import * as Long from "long";
import { getWallet } from "./authApi";
import { getAccount, decryptAccount } from "./accountApi";
import { gasCompensatorEndpoint } from "../api/constants";
import axios from "axios";

export async function exchangeOnyx(
  amount: number,
  contract: string,
  walletEncoded: any,
  password: string
) {
  const contractName = "OxgExchange";
  const funcName = "Buy";
  const wallet = getWallet(walletEncoded);
  let address = getAccount(wallet).address.toHexString();
  address = utils.reverseHex(address);
  const client = getClient();
  const privateKey = decryptAccount(wallet, password);

  const params = [
    { label: "amount", value: amount, type: ParameterType.Int },
    { label: "address", value: address, type: ParameterType.ByteArray }
  ];

  try {
    const res = await axios.post(`${gasCompensatorEndpoint}/api/compensate-gas`, {
      contractName,
      funcName,
      params
    });
    const tx = Transaction.deserialize(res.data.data);
    TransactionBuilder.addSign(tx, privateKey);
    await client.sendRawTransaction(tx.serialize(), false, true);
  } catch (err) {
    // TODO: handle errors from compensator
    if (err.response) {
      console.error("exchangeOnyx", err.response.data);
    } else {
      console.error("exchangeOnyx!!!!!!!", err);
      throw new Error(err);
    }
  }
}

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
