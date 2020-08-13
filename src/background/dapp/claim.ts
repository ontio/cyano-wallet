import { ClaimApi, Claim } from '@ont-dev/ontology-dapi';
import { saveClaims, loadClaims } from '../api/claimApi';

export const claimApi: ClaimApi = {
  async addClaims({ claims }): Promise<void> {
    const claimsState = await loadClaims();
    const newClaimsState = [...(claimsState || []), ...claims];
    await saveClaims(newClaimsState);
  },

  async getClaims(): Promise<Claim[]> {
    const claimsState = await loadClaims();
    return Promise.resolve(claimsState || []);
  }
};
