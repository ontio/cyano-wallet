import { TransactionBuilder, Parameter, ParameterType, utils, CONST, Crypto } from "ontology-ts-sdk";
import { getClient } from "../network";
import { get } from "lodash";
import * as Long from "long";

export function loginAsInvestor({ password, userName }) {
  if (password.length > 3) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ cookie: "dfssdf342423nfdsfds" }), 500);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject("username or password is not correct"), 500);
    });
  }
}

export async function getUnclaimedBalance(contract: string, secretHash: string) {
  console.log("secretHash", secretHash);

  const client = getClient();
  const funcName = "GetUnclaimed";
  const p1 = new Parameter("contract", ParameterType.ByteArray, secretHash);
  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [p1],
    new Crypto.Address(contract),
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
