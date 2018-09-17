import { Signature } from 'ontology-dapi';
import { Crypto, utils } from 'ontology-ts-sdk';
import { decryptAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { MessageSignRequest } from '../../redux/transactionRequests';
import { getStore } from '../redux';

export async function messageSign(request: MessageSignRequest, password: string): Promise<Signature> {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const privateKey = decryptAccount(wallet, password);
  const publicKey = privateKey.getPublicKey();

  const message = request.message;
  const messageHex = utils.str2hexstr(message)
  const sig = await privateKey.sign(messageHex);

  return {
    data: sig.serializeHex(),
    publicKey: publicKey.serializeHex()
  };
}

export function messageVerify(message: string, signature: Signature) {
  const messageHex = utils.str2hexstr(message)

  const sig = Crypto.Signature.deserializeHex(signature.data);
  const publicKey = Crypto.PublicKey.deserializeHex(new utils.StringReader(signature.publicKey));

  return publicKey.verify(messageHex, sig);
  
}