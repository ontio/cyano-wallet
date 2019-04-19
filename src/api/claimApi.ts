import { TransactionBuilder, /* Transaction, */ Parameter, ParameterType, utils, CONST, Crypto } from "ontology-ts-sdk";
import { getClient } from "../network";
import { get } from "lodash";
import * as Long from "long";
import { getWallet } from "./authApi";
import { getAccount, decryptAccount } from "./accountApi";
import axios from "axios";
import { restEndpoint } from "../api/constants";

export async function loginAsInvestor(data: object) {
  const url = `${restEndpoint}/login`;
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
      return { data: er.response.data.data, status: er.response.status };
    } else {
      // handle error
      console.error(loginAsInvestor, er);
      return {};
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
    console.log(e);
    return null;
  }
}

export async function claimOnyx(contract: string, secret: string, walletEncoded: any, password: string) {
  const funcName = "Claim";
  const wallet = getWallet(walletEncoded);
  const address = getAccount(wallet).address.toHexString();
  const client = getClient();
  const privateKey = decryptAccount(wallet, password);
  const pk = privateKey.getPublicKey();
  console.log("claimOnyx", { address, pk, privateKey, secret, contract });

  // const params = [
  //   { label: "secret", value: secret, type: "ByteArray" },
  //   { label: "address", value: address, type: "ByteArray" }
  // ];

  /* axios
    .post(`${compensateGasIP}/api/compensate-gas`, { funcName, contractAdress: contract, params })
    .then(async ({ data }) => {
      console.log("trx from compensator", data);
      const tx = Transaction.deserialize(data);
      
      TransactionBuilder.addSign(tx, privateKey);

      await client.sendRawTransaction(tx.serialize(), false, true);
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
    }); */

  const p1 = new Parameter("secret", ParameterType.ByteArray, secret);
  const p2 = new Parameter("address", ParameterType.ByteArray, utils.reverseHex(address));

  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [p1, p2],
    new Crypto.Address(utils.reverseHex(contract)),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`,
    new Crypto.Address(utils.reverseHex(address))
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  await client.sendRawTransaction(tx.serialize(), false, true);
}
