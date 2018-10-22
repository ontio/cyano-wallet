import { Response, SmartContractApi } from 'ontology-dapi';
import { getRequestsManager } from '../requestsManager';

export const smartContractApi: SmartContractApi = {
  async invoke({
    scriptHash,
    operation,
    args,
    gasPrice,
    gasLimit,
    requireIdentity}
  ): Promise<Response> {
    return await getRequestsManager().initScCall({
      contract: scriptHash,
      gasLimit,
      gasPrice,
      method: operation,
      parameters: args,
      requireIdentity
    });
  },

  async invokeRead({ scriptHash, operation, args }): Promise<any> {
    return await getRequestsManager().initScCallRead({
      contract: scriptHash,
      method: operation,
      parameters: args,
    });
  },

  async deploy({
    code,
    name,
    version,
    author,
    email,
    description,
    needStorage,
    gasPrice,
    gasLimit,
  }): Promise<void> {

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
