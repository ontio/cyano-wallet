import {
  TransactionBuilder,
  Transaction,
  Parameter,
  ParameterType,
  utils,
  CONST,
  Crypto
} from "ontology-ts-sdk";
import { getClient } from "../network";
import { get } from "lodash";
import * as Long from "long";
import { getWallet } from "./authApi";
import { getAccount, decryptAccount } from "./accountApi";
import axios from "axios";
import { getOptions } from "../api/constants";

export async function loginAsInvestor(data: object) {
  const options = getOptions();
  const endpoint = options.authApi.address;
  const url = `${endpoint}/login`;
  const formData = new FormData();
  for (const field in data) {
    if (data.hasOwnProperty(field)) {
      formData.append(field, data[field]);
    }
  }

  try {
    const response = await axios.post(url, formData);
    return { data: response.data.data, status: response.status };
  } catch (er) {
    if (er.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (er.response.status === 400) {
        // return { data: "Authentication server does not respond", status: er.response.status };
        return { data: er.response.data.data, status: er.response.status };
      }
      return { data: "Authentication server does not respond", status: er.response.status };
    } else if (er.request) {
      // The request was made but no response was received
      return { data: "Authentication server does not respond", status: null };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        data: "Error happened in setting up the request, please, check internet connection",
        status: null
      };
    }
  }
}

export async function getUnclaimedBalance(contract: string, secretHash: string) {
  const client = getClient();
  const funcName = "GetUnclaimed";
  const p1 = new Parameter("contract", ParameterType.ByteArray, secretHash);
  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [p1],
    new Crypto.Address(utils.reverseHex(contract)),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`
  );

  try {
    const response = await client.sendRawTransaction(tx.serialize(), true);
    const data = get(response, "Result.Result", "");
    const balance = Long.fromString(utils.reverseHex(data), true, 16).toString();
    console.log("response:", response);
    /* 
      if response = 0, user is blocked
      if error, user is not found 
    */
    return balance;
  } catch (e) {
    return null;
  }
}

export async function claimOnyx(secret: string, walletEncoded: any, password: string) {
  const contractName = "Investments";
  const funcName = "Claim";
  const wallet = getWallet(walletEncoded);
  let address = getAccount(wallet).address.toHexString();
  address = utils.reverseHex(address);
  const client = getClient();
  const privateKey = decryptAccount(wallet, password);
  const options = getOptions();
  const endpoint = options.gasCompensator.address;

  const params = [
    { label: "secret", value: secret, type: ParameterType.ByteArray },
    { label: "address", value: address, type: ParameterType.ByteArray }
  ];

  const res = await axios.post(`${endpoint}/api/compensate-gas`, {
    contractName,
    funcName,
    params
  });
  const tx = Transaction.deserialize(res.data.data);
  TransactionBuilder.addSign(tx, privateKey);
  await client.sendRawTransaction(tx.serialize(), false, true);
}
