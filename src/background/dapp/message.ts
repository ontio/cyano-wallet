import { Crypto, utils } from 'ontology-ts-sdk';
import { assetApi } from './asset';
import { identityApi } from './identity';

import PublicKey =  Crypto.PublicKey;
import Signature =  Crypto.Signature;
import { MessageApi } from 'ontology-dapi';

const messagePrefix = 'Ontology message:';

export const messageApi: MessageApi = {

  async signMessageHash(address: string, messageHash: string): Promise<void> {
    const accounts = await assetApi.getOwnAccounts();
    const identities = await identityApi.getOwnIdentities();

    const addresses = accounts.concat(identities);

    if (!addresses.includes(address)) {
      throw new Error('WRONG_ADDRESS');
    }

    throw new Error('UNSUPPORTED');
  },
  
  async verifyMessageHash(address: string, messageHash: string, signature: string): Promise<boolean> {
    const accounts = await assetApi.getOwnAccounts();
    const identities = await identityApi.getOwnIdentities();

    let publicKey: string;
    if (accounts.includes(address)) {
      publicKey = await assetApi.getPublicKey(address);
    } else if (identities.includes(address)) {
      const publicKeys = await identityApi.getPublicKeys(address);

      // todo: support more than one public key
      publicKey = publicKeys[0];
    } else {
      throw new Error('WRONG_ADDRESS');
    }
    
    return messageApi.verifyMessageHashPk(publicKey, messageHash, signature);
  },

  async verifyMessageHashPk(publicKey: string, messageHash: string, signature: string): Promise<boolean> {
    const msg = messagePrefix + messageHash;
    
    const pk = PublicKey.deserializeHex(new utils.StringReader(publicKey));
    const sig = Signature.deserializeHex(signature);

    const result = pk.verify(utils.str2hexstr(msg), sig);

    return Promise.resolve(result);
  },

  async signMessage(address: string, message: string): Promise<void> {
    const accounts = await assetApi.getOwnAccounts();
    const identities = await identityApi.getOwnIdentities();

    const addresses = accounts.concat(identities);

    if (!addresses.includes(address)) {
      throw new Error('WRONG_ADDRESS');
    }

    throw new Error('UNSUPPORTED');
  },

  async verifyMessage(address: string, message: string, signature: string): Promise<boolean> {
    throw new Error('UNSUPPORTED');
  },

  async verifyMessagePk(publicKey: string, message: string, signature: string): Promise<boolean> {
    const pk = PublicKey.deserializeHex(new utils.StringReader(message));
    const sig = Signature.deserializeHex(signature);

    const result = pk.verify(utils.str2hexstr(message), sig);

    return Promise.resolve(result);
  }
}
