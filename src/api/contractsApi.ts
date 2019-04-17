import { TransactionBuilder, Parameter, ParameterType, utils, CONST, Crypto } from "ontology-ts-sdk";
import { getClient } from "../network";
import { get } from "lodash";
import { headAddress } from "./constants";
import { getStore } from "../redux/index";

function getHeadContractAddress(net: string) {
  if (net === "TEST") {
    return new Crypto.Address(utils.reverseHex(headAddress.test));
  } else {
    return new Crypto.Address(utils.reverseHex(headAddress.main));
  }
}

export async function getContractAddress(contractName: string) {
  const state = getStore().getState();
  const net = state.settings.net;
  const client = getClient();
  const funcName = "GetContractAddress";
  const p1 = new Parameter("contractName", ParameterType.String, contractName);

  const tx = TransactionBuilder.makeInvokeTransaction(
    funcName,
    [p1],
    getHeadContractAddress(net),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`
  );
  try {
    const response = await client.sendRawTransaction(tx.serialize(), true);
    const address = utils.hexstr2str(get(response, "Result.Result"));
    return address;
  } catch (e) {
    console.log(e);
    return e;
  }
}
