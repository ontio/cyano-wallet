import { IdentityApi, OntIdAttribute, OntIdDDO } from 'ontology-dapi';
import { getIdentity } from '../../api/identityApi';
import { getStore } from '../redux';

export const identityApi: IdentityApi = {
  getOwnIdentities(): Promise<string[]> {
    const state = getStore().getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
      return Promise.reject('NO_IDENTITY');
    }

    const identity = getIdentity(wallet);

    if (identity !== null) {
      return Promise.resolve([identity]);
    } else {
      return Promise.reject('NO_IDENTITY');
    }
  },

  getDefaultIdentity(): Promise<string> {
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

  getPublicKeys(identity: string): Promise<string[]> {
    throw new Error('UNSUPPORTED');
  },

  getDDO(identity: string): Promise<OntIdDDO> {
    throw new Error('UNSUPPORTED');
  },

  getAttributes(identity: string): Promise<OntIdAttribute[]> {
    throw new Error('UNSUPPORTED');
  },

  addAttributes(identity: string, attributes: OntIdAttribute[]): Promise<void> {
    throw new Error('UNSUPPORTED');
  },

  removeAttribute(identity: string, key: string): Promise<void> {
    throw new Error('UNSUPPORTED');
  }
}
