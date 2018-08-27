import { MessageApi, Signature} from 'ontology-dapi';

// const messagePrefix = 'Ontology message:';

export const messageApi: MessageApi = {

  async signMessageHash(messageHash: string): Promise<Signature> {
    throw new Error('UNSUPPORTED');
  },
  
  async verifyMessageHash(messageHash: string, signature: Signature): Promise<boolean> {
    throw new Error('UNSUPPORTED');
  },

  async signMessage(message: string): Promise<Signature> {
    throw new Error('UNSUPPORTED');
  },

  async verifyMessage(message: string, signature: Signature): Promise<boolean> {
    throw new Error('UNSUPPORTED');
  }
}
