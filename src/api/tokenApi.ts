import { Crypto, Oep4, utils /* TransactionBuilder, Parameter, ParameterType */ } from "ontology-ts-sdk";
import { isHexadecimal } from "../utils";
import { getClient } from "../network";
import Address = Crypto.Address;
import Oep4TxBuilder = Oep4.Oep4TxBuilder;
// import { getStore } from "../redux";
// import { getAccount /* decryptAccount */ } from "./accountApi";
// import { getWallet } from "./authApi";
export interface OEP4Token {
  name: string;
  symbol: string;
  decimals: number;
}
export interface OEP4TokenAmount extends OEP4Token {
  amount: string;
}

export async function getOEP4Token(contract: string): Promise<OEP4Token> {
  if (!isHexadecimal(contract)) {
    throw new Error("Contract is not hexadecimal string");
  }
  // contract = utils.reverseHex(contract);
  const builder = new Oep4TxBuilder(new Address(contract));

  const client = getClient();
  const symbolResponse = await client.sendRawTransaction(builder.querySymbol().serialize(), true);
  const nameResponse = await client.sendRawTransaction(builder.queryName().serialize(), true);
  const decimalsResponse = await client.sendRawTransaction(builder.queryDecimals().serialize(), true);

  return {
    decimals: extractNumberResponse(decimalsResponse),
    name: extractStringResponse(nameResponse),
    symbol: extractStringResponse(symbolResponse)
  };
}

function extractStringResponse(response: any) {
  if (response !== undefined && response.Result !== undefined && response.Result.Result !== undefined) {
    return utils.hexstr2str(response.Result.Result);
  } else {
    return "";
  }
}

function extractNumberResponse(response: any) {
  if (response !== undefined && response.Result !== undefined && response.Result.Result !== undefined) {
    return parseInt(utils.reverseHex(response.Result.Result), 16);
  } else {
    return 0;
  }
}
