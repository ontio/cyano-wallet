import BigNumber from 'bignumber.js';
import { getClient } from '../network';
import { EventListener, Parameter } from './types';

export async function deploy(code: string, name: string, version: string, author: string, email: string, 
    description: string, needStorage: boolean, gasPrice: BigNumber, gasLimit: BigNumber): Promise<void> {
        return Promise.reject();
}

export async function invoke(constractAddress: string, method: string, parameters: Parameter[], 
    gasPrice: BigNumber, gasLimit: BigNumber): Promise<void> {
        // const client = getClient();
        
        // TransactionBuilder.makeInvokeTransaction(method, null, constractAddress, gasPrice, gasLimit );
        return Promise.reject();
}

export function addEventListener(listener: EventListener): void {
    const client = getClient();
    client.addNotifyListener(listener);
}

/**
 * todo
 * @param listener 
 */
export function removeEventListener(listener: EventListener): void {
    // const client = getClient();
    // client.removeNotifyListener(listener);
}