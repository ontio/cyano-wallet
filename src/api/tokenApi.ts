import * as Long from "long";
import { Crypto, Oep4, utils /* RestClient, TransactionBuilder , Parameter, ParameterType */ } from "ontology-ts-sdk";
import { isHexadecimal } from "../utils";
import { getClient } from "../network";
import Address = Crypto.Address;
import Oep4TxBuilder = Oep4.Oep4TxBuilder;
import { getStore } from "../redux";
import { getAccount /* decryptAccount */ } from "./accountApi";
import { getWallet } from "./authApi";
export interface OEP4Token {
  name: string;
  symbol: string;
  decimals: number;
}
export interface OEP4TokenAmount extends OEP4Token {
  amount: string;
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
  console.log(symbolResponse, nameResponse, decimalsResponse);

  return {
    decimals: extractNumberResponse(decimalsResponse),
    name: extractStringResponse(nameResponse),
    symbol: extractStringResponse(symbolResponse)
  };
}

export async function getTokenBalanceOwn(contract: string, walletEncoded: any) {
  const wallet = getWallet(walletEncoded);
  const address = getAccount(wallet).address;

  return getTokenBalance(contract, address);
}

export async function getTokenBalance(contract: string, address: Address) {
  const state = getStore().getState();

  const token = state.settings.tokens.find(t => t.contract === contract);

  if (token === undefined) {
    throw new Error("OEP-4 token not found.");
  }

  // contract = utils.reverseHex(contract);

  const builder = new Oep4TxBuilder(new Address(contract));

  const client = getClient();
  const tx = builder.queryBalanceOf(address);
  const response = await client.sendRawTransaction(tx.serialize(), true);
  console.log("$$$$$", response);

  return Long.fromString(utils.reverseHex(response.Result.Result), true, 16).toString();
}

/* export async function transferToken(request: TransferRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const token = state.settings.tokens.find(t => t.symbol === request.asset);
  if (token === undefined) {
    throw new Error("OEP-4 token not found.");
  }

  const contract = utils.reverseHex(token.contract);
  const builder = new Oep4TxBuilder(new Address(contract));

  const from = getAccount(state.wallet.wallet!).address;
  const privateKey = decryptAccount(wallet, password);

  const to = new Address(request.recipient);
  const amount = String(request.amount);

  const tx = builder.makeTransferTx(
    from,
    to,
    encodeAmount(amount, token.decimals),
    "500",
    `${CONST.DEFAULT_GAS_LIMIT}`,
    from
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
} */
