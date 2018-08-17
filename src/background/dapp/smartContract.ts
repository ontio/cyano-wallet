import { Parameter, SmartContractApi } from 'ontology-dapi';

export const smartContractApi: SmartContractApi = {
  invoke(
    account: string,
    contract: string,
    method: string,
    parameters: Parameter[],
    gasPrice: number,
    gasLimit: number,
    addresses: string[]
  ): Promise<void> {
    throw new Error('UNSUPPORTED');
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
    gasLimit: number
  ): Promise<void> {
    throw new Error('UNSUPPORTED');
  }
}
