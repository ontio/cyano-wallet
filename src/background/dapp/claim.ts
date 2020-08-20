import { Claim, ClaimApi } from '@ont-dev/ontology-dapi';
import { Claim as OntClaim } from 'ontology-ts-sdk';
import { setClaims } from '../../redux/claims';
import { getStore } from '../redux';

export const claimApi: ClaimApi = {
   addClaim({ claim }): Promise<void> {
    if (claim.bodyEncrypted) {
      return Promise.reject('UNSUPPORTED');
    }
    try {
      OntClaim.deserialize(claim.body);
    } catch {
      return Promise.reject('INVALID_MESSAGE');
    }
    const state = getStore().getState();
    const newClaims = state.claims.slice();
    newClaims.unshift(claim);

    getStore().dispatch(setClaims(newClaims));
    return Promise.resolve();
  },

  getClaims(): Promise<Claim[]> {
    const state = getStore().getState();
    const claims = state.claims;

    return Promise.resolve(claims);
  }
};
