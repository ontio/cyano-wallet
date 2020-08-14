import { Claim, ClaimApi } from '@ont-dev/ontology-dapi';
import { setClaims } from '../../redux/claims';
import { getStore } from '../redux';

export const claimApi: ClaimApi = {
   addClaim({ claim }): Promise<void> {
    if (claim.bodyEncrypted) {
      return Promise.reject('UNSUPPORTED');
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
