import * as Long from 'long';
import { CONST, Crypto, Oep4, Parameter, ParameterType, TransactionBuilder, utils } from 'ontology-ts-sdk';
import { decryptAccount, getAccount } from 'src/api/accountApi';
import { encodeAmount } from 'src/popup/utils/number';
import { TransferRequest } from 'src/redux/transactionRequests';
import { getWallet } from '../../api/authApi';
import { OEP4Token, VmType } from '../../api/tokenApi';
import { getClient } from '../network';
import { getStore } from '../redux';

import Address = Crypto.Address;
import Oep4TxBuilder = Oep4.Oep4TxBuilder;
import { isHexadecimal } from 'src/api/utils';

const gasPrice = '500';
const gasLimit = '20000';
export async function getOEP4Token(contract: string): Promise<OEP4Token> {
  if (!isHexadecimal(contract)) {
    throw new Error('Contract is not hexadecimal string');
  }
  // TODO 需要支持wasm vm的oep4；转账也要分NEO和wasm；

  const contractAddr = utils.reverseHex(contract);
  const builder = new Oep4TxBuilder(new Address(contractAddr));

  const client = getClient();
  // first get contract json to decide the vmType
  const contractJson = await client.getContractJson(contract);
  let vmType: VmType = 'NEOVM';
  if (contractJson && contractJson.Error === 0) {
    if (contractJson.Result && contractJson.Result.VmType === 3) {
      vmType = 'WASMVM';
    }
  }
  let nameResponse;
  let symbolResponse;
  let decimalsResponse;
  if (vmType === 'WASMVM') {
    const tx1 = TransactionBuilder.makeWasmVmInvokeTransaction(
      'name',
      [],
      new Address(contractAddr),
      gasPrice,
      gasLimit,
    );
    nameResponse = await client.sendRawTransaction(tx1.serialize(), true);
    const tx2 = TransactionBuilder.makeWasmVmInvokeTransaction(
      'symbol',
      [],
      new Address(contractAddr),
      gasPrice,
      gasLimit,
    );
    symbolResponse = await client.sendRawTransaction(tx2.serialize(), true);
    const tx3 = TransactionBuilder.makeWasmVmInvokeTransaction(
      'decimals',
      [],
      new Address(contractAddr),
      gasPrice,
      gasLimit,
    );
    decimalsResponse = await client.sendRawTransaction(tx3.serialize(), true);
  } else {
    nameResponse = await client.sendRawTransaction(builder.queryName().serialize(), true);
    symbolResponse = await client.sendRawTransaction(builder.querySymbol().serialize(), true);
    decimalsResponse = await client.sendRawTransaction(builder.queryDecimals().serialize(), true);
  }

  return {
    decimals: extractNumberResponse(decimalsResponse),
    name: extractStringResponse(nameResponse),
    symbol: extractStringResponse(symbolResponse),
    vmType,
  };
}

export async function getTokenBalanceOwn(contract: string, vmType: VmType) {
  const state = getStore().getState();
  const address = getAccount(state.wallet.wallet!).address;

  return getTokenBalance(contract, address, vmType);
}

export async function getTokenBalance(contract: string, address: Address, vmType: VmType) {
  const state = getStore().getState();

  const token = state.settings.tokens.find((t) => t.contract === contract);
  if (token === undefined) {
    throw new Error('OEP-4 token not found.');
  }

  contract = utils.reverseHex(contract);
  const client = getClient();
  let response;
  if (vmType === 'WASMVM') {
    const params = [new Parameter('param1', ParameterType.Address, address)];
    const tx = TransactionBuilder.makeWasmVmInvokeTransaction(
      'balanceOf',
      params,
      new Address(contract),
      gasPrice,
      gasLimit,
    );
    response = await client.sendRawTransaction(tx.serialize(), true);
  } else {
    const builder = new Oep4TxBuilder(new Address(contract));
    const tx = builder.queryBalanceOf(address);
    response = await client.sendRawTransaction(tx.serialize(), true);
  }
    const resultValue = utils.reverseHex(response.Result.Result);
  return resultValue ? Long.fromString(resultValue, true, 16).toString() : '0';
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
    let tx;
    if (token.vmType === 'WASMVM') {
        const params = [
            new Parameter('from', ParameterType.Address, from),
            new Parameter('to', ParameterType.Address, to),
            new Parameter('amount', ParameterType.Long, encodeAmount(amount, token.decimals))
        ];
         tx = TransactionBuilder.makeWasmVmInvokeTransaction(
        'transfer',
        params,
        new Address(contract),
        gasPrice,
             `${CONST.DEFAULT_GAS_LIMIT}`,
        from
        );
    } else {
        tx = builder.makeTransferTx(
            from,
            to,
            encodeAmount(amount, token.decimals),
            '500',
            `${CONST.DEFAULT_GAS_LIMIT}`,
            from,
          );
    }

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
  if (response !== undefined && response.Result !== undefined && response.Result.Result !== undefined && response.Result.Result !== '') {
    return parseInt(utils.reverseHex(response.Result.Result), 16);
  } else {
    return 0;
  }
}
