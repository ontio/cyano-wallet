import * as Long from "long";
import { Crypto, Oep4, utils, TransactionBuilder, CONST /* Parameter, ParameterType */ } from "ontology-ts-sdk";
import { isHexadecimal } from "../utils";
import { encodeAmount } from "../utils/number";
import { getClient } from "../network";
import Address = Crypto.Address;
import Oep4TxBuilder = Oep4.Oep4TxBuilder;
import { getStore } from "../redux";
import { getAccount, decryptAccount } from "./accountApi";
import { getWallet } from "./authApi";
import { AssetType } from "../redux/runtime";

export interface OEP4Token {
  name: string;
  symbol: string;
  decimals: number;
}
export interface OEP4TokenAmount extends OEP4Token {
  amount: string;
}

export type TransactionType = "transfer" | "withdraw_ong";

export type ErrorCode = "TIMEOUT" | "WRONG_PASSWORD" | "CANCELED" | "OTHER";

export interface TransactionRequest {
  id: string;
  type: TransactionType;
  resolved?: boolean;
  error?: ErrorCode;
  result?: any;
}

export interface TransferRequest extends TransactionRequest {
  sender: string;
  recipient: string;
  amount: number;
  asset: AssetType;
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

  return Long.fromString(utils.reverseHex(response.Result.Result), true, 16).toString();
}

export async function transferToken(
  walletEncoded: any,
  password: string,
  recipient: string,
  asset: string,
  amount: string
) {
  console.log("in transferToken", password, walletEncoded, recipient, asset, amount);

  const wallet = getWallet(walletEncoded);
  const state = getStore().getState();
  const from = getAccount(wallet).address;
  const privateKey = decryptAccount(wallet, password);

  const token = state.settings.tokens.find(t => t.symbol === asset);
  if (token === undefined) {
    throw new Error("OEP-4 token not found.");
  }

  const contract = token.contract;
  const builder = new Oep4TxBuilder(new Address(contract));

  const to = new Address(recipient);
  amount = String(amount);

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
}
