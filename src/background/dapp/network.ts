import Address = Crypto.Address;
import { Asset, Balance, Block, MerkleProof, Network, NetworkApi, Transaction } from 'ontology-dapi';
import { Crypto } from 'ontology-ts-sdk';
import { getClient } from '../network';
import { getStore } from '../redux';

export const networkApi: NetworkApi = {

    /**
     * Checks if connected to network.
     * Because of multiple delays in different parts of browser and api,
     * the information about disconnect is not instant.
     */
    isConnected(): Promise<boolean> {
        const state = getStore().getState();
        const status = state.status.networkState;

        return Promise.resolve(status === 'CONNECTED');
    },

    /**
     * Gets the currently connected network.
     */
    getNetwork(): Promise<Network> {
        const state = getStore().getState();
        return Promise.resolve(state.settings.net);
    },

    async getBalance(address: string): Promise<Balance> {
        const client = getClient();
        const response = await client.getBalance(new Address(address));
        return {
            ong: response.Result.ong,
            ont: response.Result.ont
        };
    },

    async getBlock(block: number | string): Promise<Block> {
        const client = getClient();
        const response = await client.getBlockJson(block);
        return response.Result;
    },

    async getTransaction(txHash: string): Promise<Transaction> {
        const client = getClient();
        const response = await client.getRawTransactionJson(txHash);
        return response.Result;
    },

    async getGenerateBlockTime(): Promise<number | null> {
        const client = getClient();
        const response = await client.getGenerateBlockTime();
        return response.Result;
    },

    async getNodeCount(): Promise<number> {
        const client = getClient();
        const response = await client.getNodeCount();
        return response.Result;
    },

    async getBlockHeight(): Promise<number> {
        const client = getClient();
        const response = await client.getBlockHeight();
        return response.Result;
    },

    async getMerkleProof(txHash: string): Promise<MerkleProof> {
        const client = getClient();
        const response = await client.getMerkleProof(txHash);
        return response.Result;
    },

    async getStorage(constractAddress: string, key: string): Promise<string> {
        const client = getClient();
        const response = await client.getStorage(constractAddress, key);
        return response.Result;
    },

    async getAllowance(asset: Asset, fromAddress: string, toAddress: string): Promise<number> {
        const client = getClient();
        const response = await client.getAllowance(asset, new Address(fromAddress), new Address(toAddress));
        return response.Result;
    }
}
