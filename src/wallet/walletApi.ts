import { get } from 'lodash';
import {  RestClient } from 'ont-sdk-ts';
import { getWallet } from '../auth/authApi';

const restClient = new RestClient();

export async function getBalance(walletEncoded: any) {
    const wallet = getWallet(walletEncoded);

    const response = await restClient.getBalance(wallet.accounts[0].address);
    const ont: number = get(response, 'Result.ont');
    const ong: number = get(response, 'Result.ong');
    
    return {
        ong,
        ont
    };
}
