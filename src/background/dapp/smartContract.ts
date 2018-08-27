import { Parameter, Response, SmartContractApi } from 'ontology-dapi';
import { getRequestsManager } from '../requestsManager';

export const smartContractApi: SmartContractApi = {
  async invoke(
    contract: string,
    method: string,
    parameters: Parameter[],
    gasPrice: number,
    gasLimit: number,
    requireIdentity: boolean
  ): Promise<Response> {
    return await getRequestsManager().initScCall({
      contract,
      gasLimit,
      gasPrice,
      method,
      parameters,
      requireIdentity
    });
  },

  async invokeRead(contract: string, method: string, parameters: Parameter[]): Promise<any> {
    return await getRequestsManager().initScCallRead({
      contract,
      method,
      parameters,
    });
  },

  async deploy(
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

    return await getRequestsManager().initScDeploy({
      author,
      code,
      description,
      email,
      gasLimit,
      gasPrice,
      name,
      needStorage,
      version,
    });
  },
};
