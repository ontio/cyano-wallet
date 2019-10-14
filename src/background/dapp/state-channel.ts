import { Signature } from '@ont-dev/ontology-dapi';
import { StateChannelApi } from '@ont-dev/ontology-dapi';

export const stateChannelApi: StateChannelApi = {
  async login(): Promise<string> {
    throw new Error('UNSUPPORTED');
  },

  async sign({  }: { channelId: string; scriptHash: string; message: string }): Promise<Signature> {
    throw new Error('UNSUPPORTED');
  },
};
