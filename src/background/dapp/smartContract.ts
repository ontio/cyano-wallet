import { Response, SmartContractApi } from 'ontology-dapi';
import { getRequestsManager } from '../requestsManager';

export const smartContractApi: SmartContractApi = {
  async invoke({
    contract,
    method,
    parameters,
    gasPrice,
    gasLimit,
    requireIdentity}
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

  async invokeRead({ contract, method, parameters }): Promise<any> {
    return await getRequestsManager().initScCallRead({
      contract,
      method,
      parameters,
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
