import { Response, SmartContractApi } from '@ont-dev/ontology-dapi';
import { Hash } from 'ontology-ts-crypto';

import { getRequestsManager } from '../requestsManager';

async function invoke(options: any): Promise<Response> {
  const { scriptHash, operation, args, gasPrice, gasLimit, requireIdentity, isWasmVm } = options;

  const oldOptions: any = options;

  const parameters = args !== undefined ? args : oldOptions.parameters;
  const paramsHash = Hash.sha256(new Buffer(JSON.stringify(parameters))).toString('hex');

  return await getRequestsManager().initScCall({
    contract: scriptHash !== undefined ? scriptHash : oldOptions.contract,
    gasLimit,
    gasPrice,
    isWasmVm,
    method: operation !== undefined ? operation : oldOptions.method,
    parameters,
    paramsHash,
    requireIdentity,
  });
}

async function invokeRead(options: any): Promise<Response> {
  const { scriptHash, operation, args, isWasmVm } = options;

    const oldOptions: any = options;

  return await getRequestsManager().initScCallRead({
    contract: scriptHash !== undefined ? scriptHash : oldOptions.contract,
    isWasmVm,
    method: operation !== undefined ? operation : oldOptions.method,
      parameters: args !== undefined ? args : oldOptions.parameters,
    });
}

export const smartContractApi: SmartContractApi = {
  async invoke(options: any): Promise<Response> {
    return invoke(options);
  },
  async invokeWasm(options: any): Promise<Response> {
    return invoke(Object.assign({}, options, { isWasmVm: true }));
  },

  async invokeRead(options: any): Promise<any> {
    return invokeRead(options);
  },

  async invokeWasmRead(options: any): Promise<any> {
    return invokeRead(Object.assign({}, options, { isWasmVm: true }));
  },

  async deploy({ code, name, version, author, email, description, vmType, gasPrice, gasLimit }): Promise<void> {
    return await getRequestsManager().initScDeploy({
      author,
      code,
      description,
      email,
      gasLimit,
      gasPrice,
      name,
      version,
      vmType,
    });
  },
};
