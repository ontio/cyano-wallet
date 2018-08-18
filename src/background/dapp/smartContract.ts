import { Parameter, SmartContractApi } from 'ontology-dapi';
import { getRequestsManager } from '../requestsManager';
import { assetApi } from './asset';

export const smartContractApi: SmartContractApi = {
  async invoke(
    account: string,
    contract: string,
    method: string,
    parameters: Parameter[],
    gasPrice: number,
    gasLimit: number,
    addresses: string[],
  ): Promise<void> {
    const accounts = await assetApi.getOwnAccounts();
    if (!accounts.includes(account)) {
      throw new Error('WRONG_ACCOUNT');
    }

    return await getRequestsManager().initScCall({
      account,
      addresses,
      contract,
      gasLimit,
      gasPrice,
      method,
      parameters
    });
  },

  invokeRead(contract: string, method: string, parameters: Parameter[]): Promise<any> {
    throw new Error('UNSUPPORTED');
  },

  deploy(
    account: string,
    code: string,
    name: string,
    version: string,
    author: string,
    email: string,
    description: string,
    needStorage: boolean,
    gasPrice: number,
    gasLimit: number,
  ): Promise<void> {
    throw new Error('UNSUPPORTED');
  },
};
