import { Response, SmartContractApi } from 'ontology-dapi';
import { Hash } from 'ontology-ts-crypto';

import { getRequestsManager } from '../requestsManager';

export const smartContractApi: SmartContractApi = {
  async invoke(options): Promise<Response> {
    const { scriptHash, operation, args, gasPrice, gasLimit, requireIdentity } = options;

    const oldOptions: any = options;

    const parameters = args !== undefined ? args : oldOptions.parameters;
    const paramsHash = Hash.sha256(new Buffer(JSON.stringify(parameters))).toString('hex');

    return await getRequestsManager().initScCall({
      contract: scriptHash !== undefined ? scriptHash : oldOptions.contract,
      gasLimit,
      gasPrice,
      method: operation !== undefined ? operation : oldOptions.method,
      parameters,
      paramsHash,
      requireIdentity,
    });
  },

  async invokeRead(options): Promise<any> {
    const { scriptHash, operation, args } = options;

    const oldOptions: any = options;

    return await getRequestsManager().initScCallRead({
      contract: scriptHash !== undefined ? scriptHash : oldOptions.contract,
      method: operation !== undefined ? operation : oldOptions.method,
      parameters: args !== undefined ? args : oldOptions.parameters,
    });
  },

  async deploy({ code, name, version, author, email, description, needStorage, gasPrice, gasLimit }): Promise<void> {
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
