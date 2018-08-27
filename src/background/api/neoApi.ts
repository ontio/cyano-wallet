import { AbiInfo, Crypto, NeoCore, Parameter, ParameterType, utils } from 'ontology-ts-sdk';
import { decryptAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { SwapRequest } from '../../redux/transactionRequests';
import { getNeoNodeAddress } from '../network';
import { getStore } from '../redux';

import Address = Crypto.Address;
import PrivateKey = Crypto.PrivateKey;
import SignatureScheme = Crypto.SignatureScheme;

const ontContract = 'ceab719b8baa2310f232ee0d277c061704541cfb';
const swapAddress = 'AFmseVrdL9f9oyCzZefL9tG6UbvhPbdYzM';

// tslint:disable-next-line:max-line-length
const NEP5_ABI = '{"hash":"0x5bb169f915c916a5e30a3c13a5e0cd228ea26826","entrypoint":"Main","functions":[{"name":"Name","parameters":[],"returntype":"String"},{"name":"Symbol","parameters":[],"returntype":"String"},{"name":"Decimals","parameters":[],"returntype":"Integer"},{"name":"Main","parameters":[{"name":"operation","type":"String"},{"name":"args","type":"Array"}],"returntype":"Any"},{"name":"Init","parameters":[],"returntype":"Boolean"},{"name":"TotalSupply","parameters":[],"returntype":"Integer"},{"name":"Transfer","parameters":[{"name":"from","type":"ByteArray"},{"name":"to","type":"ByteArray"},{"name":"value","type":"Integer"}],"returntype":"Boolean"},{"name":"BalanceOf","parameters":[{"name":"address","type":"ByteArray"}],"returntype":"Integer"}],"events":[{"name":"transfer","parameters":[{"name":"arg1","type":"ByteArray"},{"name":"arg2","type":"ByteArray"},{"name":"arg3","type":"Integer"}],"returntype":"Void"}]}';


export async function getNepBalance() {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const nodeAddress = getNeoNodeAddress();

  if (nodeAddress !== null) {
    const response: any | undefined = await NeoCore.NeoRpc.getBalance(
      nodeAddress,
      new Address(utils.reverseHex(ontContract)),
      wallet.accounts[0].address,
    );

    if (response == null || response.result == null) {
      return 0;
    } else {
      return parseInt(utils.reverseHex(response.result), 16);
    }
  } else {
    return null;
  }
}

export async function swapNep(request: SwapRequest, password: string) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const from = wallet.accounts[0].address;
  const to = new Address(swapAddress);
  const privateKey = decryptAccount(wallet, password);

  const tx = constructNepTransfer(from, to, request.amount);
  await signTransaction(tx, privateKey);

  const nodeAddress = getNeoNodeAddress();
  const response: any | undefined = await NeoCore.NeoRpc.sendRawTransaction(
    nodeAddress,
    tx.serialize()
  );

  if (response === undefined || response.result === undefined) {
    throw new Error('SWAP_ERROR');
  } else {
    return utils.reverseHex(tx.getHash());
  }
}

export function constructNepTransfer(from: Address, to: Address, amount: number) {
  const abiInfo = AbiInfo.parseJson(NEP5_ABI);
  const contractAddr = new Address(utils.reverseHex(ontContract));

  const func = abiInfo.getFunction('Transfer');
  func.name = func.name.toLowerCase();

  const p1 = new Parameter('from', ParameterType.ByteArray, from.serialize());
  const p2 = new Parameter('to', ParameterType.ByteArray, to.serialize());
  const p3 = new Parameter('value', ParameterType.Integer, amount);
  func.setParamsValue(p1, p2, p3);

  return NeoCore.SmartContract.makeInvokeTransaction(contractAddr, from, func);
}

export async function signTransaction(tx: NeoCore.TransactionNeo, privateKey: PrivateKey) {
  const sigData = await constructSignature(tx, privateKey);

  const p = new NeoCore.Program();
  p.parameter = NeoCore.Program.programFromParams([sigData]);
  p.code = NeoCore.Program.programFromPubKey(privateKey.getPublicKey());
  tx.scripts = [p]; 
}

export async function constructSignature(tx: NeoCore.TransactionNeo, privateKey: PrivateKey) {
  const sig = await privateKey.signAsync(tx, SignatureScheme.ECDSAwithSHA256);
  const sigHex = sig.serializeHex();
  const signature = sigHex.substring(2);
  return signature;
}
