import { IdentityApi, OntIdDDO } from 'ontology-dapi';
import { getIdentity } from '../../api/identityApi';
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
    throw new Error('UNSUPPORTED');
  },

  addAttributes({ attributes }): Promise<void> {
    throw new Error('UNSUPPORTED');
  },

  removeAttribute({ key }): Promise<void> {
    throw new Error('UNSUPPORTED');
  }
}
