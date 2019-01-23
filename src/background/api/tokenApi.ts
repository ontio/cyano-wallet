import * as Long from 'long';
import { CONST, Crypto, Oep4, TransactionBuilder, utils } from 'ontology-ts-sdk';
import { decryptAccount, getAccount } from 'src/api/accountApi';
import { encodeAmount } from 'src/popup/utils/number';
import { TransferRequest } from 'src/redux/transactionRequests';
import { getWallet } from '../../api/authApi';
import { OEP4Token } from '../../api/tokenApi';
import { getClient } from '../network';
import { getStore } from '../redux';

import Address = Crypto.Address;
import Oep4TxBuilder = Oep4.Oep4TxBuilder;
import { isHexadecimal } from 'src/api/utils';

export async function getOEP4Token(contract: string): Promise<OEP4Token> {
  if (!isHexadecimal(contract)) {
    throw new Error('Contract is not hexadecimal string');
  }
  contract = utils.reverseHex(contract);

  const builder = new Oep4TxBuilder(new Address(contract));

  const client = getClient();
  const nameResponse = await client.sendRawTransaction(builder.queryName().serialize(), true);
  const symbolResponse = await client.sendRawTransaction(builder.querySymbol().serialize(), true);
  const decimalsResponse = await client.sendRawTransaction(builder.queryDecimals().serialize(), true);

  return {
    decimals: extractNumberResponse(decimalsResponse),
    name: extractStringResponse(nameResponse),
    symbol: extractStringResponse(symbolResponse),
  };
}

export async function getTokenBalanceOwn(contract: string) {
  const state = getStore().getState();
  const address = getAccount(state.wallet.wallet!).address;

  return getTokenBalance(contract, address);
}

export async function getTokenBalance(contract: string, address: Address) {
  const state = getStore().getState();

  const token = state.settings.tokens.find((t) => t.contract === contract);
  if (token === undefined) {
    throw new Error('OEP-4 token not found.');
  }

  contract = utils.reverseHex(contract);

  const builder = new Oep4TxBuilder(new Address(contract));

  const client = getClient();
  const tx = builder.queryBalanceOf(address);
  const response = await client.sendRawTransaction(tx.serialize(), true);

  return Long.fromString(utils.reverseHex(response.Result.Result), true, 16).toString();
}

export async function transferToken(request: TransferRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const token = state.settings.tokens.find((t) => t.symbol === request.asset);
  if (token === undefined) {
    throw new Error('OEP-4 token not found.');
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
    '500',
    `${CONST.DEFAULT_GAS_LIMIT}`,
    from,
  );

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
}

function extractStringResponse(response: any) {
  if (response !== undefined && response.Result !== undefined && response.Result.Result !== undefined) {
    return utils.hexstr2str(response.Result.Result);
  } else {
    return '';
  }
}

function extractNumberResponse(response: any) {
  if (response !== undefined && response.Result !== undefined && response.Result.Result !== undefined) {
    return parseInt(utils.reverseHex(response.Result.Result), 16);
  } else {
    return 0;
  }
}
