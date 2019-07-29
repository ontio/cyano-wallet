import {
  TransactionBuilder,
  Parameter,
  ParameterType,
  CONST,
  Crypto
} from "ontology-ts-sdk";
import { getClient } from "../network";
import { get } from "lodash";
import { getOptions } from "./constants";

export async function getContractAddress(contractName: string) {
  const options = getOptions();
  const contract = options.head.address;
  const client = getClient();
  const funcName = "GetContractAddress";
  const p1 = new Parameter("contractName", ParameterType.String, contractName);

  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [p1],
    new Crypto.Address(contract),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`
  );

  const response = await client.sendRawTransaction(tx.serialize(), true);
  // contract address should be reversed in trx builder!
  const address = get(response, "Result.Result");
  return address;
}
