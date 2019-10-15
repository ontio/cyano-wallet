import { MessageApi, Signature } from '@ont-dev/ontology-dapi';
import { messageVerify } from '../api/messageApi';
import { getRequestsManager } from '../requestsManager';

// const messagePrefix = 'Ontology message:';

export const messageApi: MessageApi = {

  async signMessageHash({ messageHash }): Promise<Signature> {
    throw new Error('UNSUPPORTED');
  },
  
  async verifyMessageHash({ messageHash, signature }): Promise<boolean> {
    throw new Error('UNSUPPORTED');
  },

  signMessage({ message }): Promise<Signature> {
    return getRequestsManager().initMessageSign({message});
  },

  async verifyMessage({ message, signature }): Promise<boolean> {
    return Promise.resolve(messageVerify(message, signature));
  }
}
