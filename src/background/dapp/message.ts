import { MessageApi, Signature } from 'ontology-dapi';

// const messagePrefix = 'Ontology message:';

export const messageApi: MessageApi = {

  async signMessageHash({ messageHash }): Promise<Signature> {
    throw new Error('UNSUPPORTED');
  },
  
  async verifyMessageHash({ messageHash, signature }): Promise<boolean> {
    throw new Error('UNSUPPORTED');
  },

  async signMessage({ message }): Promise<Signature> {
    throw new Error('UNSUPPORTED');
  },

  async verifyMessage({ message, signature }): Promise<boolean> {
    throw new Error('UNSUPPORTED');
  }
}
