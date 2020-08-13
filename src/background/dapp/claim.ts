import { ClaimApi, Claim } from '@ont-dev/ontology-dapi';
import { saveClaims, loadClaims } from '../api/claimApi';

export const claimApi: ClaimApi = {
  async addClaim({ claim }): Promise<void> {
    if (claim.bodyEncrypted) {
      throw 'UNSUPPORTED';
    }
    const claimsState = await loadClaims();
    const newClaimsState = [...(claimsState || []), claim];
    await saveClaims(newClaimsState);
  },

  async getClaims(): Promise<Claim[]> {
    const claimsState = await loadClaims();
    return Promise.resolve(claimsState || []);
  }
};
