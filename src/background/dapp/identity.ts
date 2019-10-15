import { IdentityApi, OntIdDDO } from '@ont-dev/ontology-dapi';
import { DDO, OntidContract } from 'ontology-ts-sdk';
import { getIdentity } from '../../api/identityApi';
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
};
