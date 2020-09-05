import { IdentityApi, OntIdDDO } from '@ont-dev/ontology-dapi';
import { DDO, OntidContract, SimpleMessage } from 'ontology-ts-sdk';
import { encodeWallet, getWallet } from '../../api/authApi';
import { getCredentialRecords } from '../../api/extraApi';
import { getIdentity } from '../../api/identityApi';
import { setWallet } from '../../redux/wallet'
import { getClient } from '../network';
import { getStore } from '../redux';

export const identityApi: IdentityApi = {
  getIdentity(): Promise<string> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_IDENTITY');
    }

    const identity = getIdentity(wallet);
    if (identity !== null) {
      return Promise.resolve(identity);
    } else {
      return Promise.reject('NO_IDENTITY');
    }
  },

  getDDO({ identity }): Promise<OntIdDDO> {
    const tx = OntidContract.buildGetDDOTx(identity);
    const rest = getClient();

    return rest.sendRawTransaction(tx.serialize(), true).then((res) => {
      return DDO.deserialize(res.Result.Result);
    });
  },

  addAttributes({ attributes }): Promise<void> {
    throw new Error('UNSUPPORTED');
  },

  removeAttribute({ key }): Promise<void> {
    throw new Error('UNSUPPORTED');
  },

  async addCredential({ tags, credential }): Promise<void> {
    const state = getStore().getState();
    const wallet = getWallet(state.wallet.wallet!);

    const identity = getIdentity(wallet);
    if (identity === null) {
      return Promise.reject('NO_IDENTITY');
    }

    try {
      SimpleMessage.deserialize(credential);
    } catch {
      return Promise.reject('INVALID_CREDENTIAL');
    }

    const credentialRecords = getCredentialRecords(wallet).slice();
    credentialRecords.unshift({ identity, tags, credential });
    wallet.extra = { ...(wallet.extra || {}), credentialRecords };

    getStore().dispatch(setWallet(encodeWallet(wallet)));
  },

  async getCredentials(): Promise<Array<{ tags: string[], credential: string }>> {
    const state = getStore().getState();
    const wallet = getWallet(state.wallet.wallet!);

    const identity = getIdentity(wallet);
    if (identity === null) {
      return Promise.reject('NO_IDENTITY');
    }

    const credentialRecords = getCredentialRecords(wallet);
    const result = credentialRecords
      .filter((record: any) => record.identity === identity)
      .map((record: any) => ({ tags: record.tags, credential: record.credential }));
    
    return result;
  }
};
