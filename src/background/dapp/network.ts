import Address = Crypto.Address;
import { Balance, Block, MerkleProof, Network, NetworkApi, Transaction } from '@ont-dev/ontology-dapi';
import { Crypto } from 'ontology-ts-sdk';
import { decodeAmount } from 'src/popup/utils/number';
import { getTokenBalance } from '../api/tokenApi';
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
        return Promise.resolve({
            address: state.settings.address,
            type: state.settings.net
        });
    },

    async getBalance({ address }): Promise<Balance> {
        const state = getStore().getState();
        const client = getClient();
        const response = await client.getBalance(new Address(address));

        const balance: Balance = {
            ONG: decodeAmount(response.Result.ong, 9),
            ONT: response.Result.ont,     
        };

        const addr = new Address(address);
        for (const token of state.settings.tokens) {
            const tokenBalance = await getTokenBalance(token.contract, addr, token.vmType);
            
            balance[token.symbol] = decodeAmount(tokenBalance, token.decimals);
        }

        return balance;
    },

    async getBlock({ block }): Promise<Block> {
        const client = getClient();
        const response = await client.getBlockJson(block);
        return response.Result;
    },

    async getTransaction({ txHash }): Promise<Transaction> {
        const client = getClient();
        const response = await client.getRawTransactionJson(txHash);
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

    async getMerkleProof({ txHash }): Promise<MerkleProof> {
        const client = getClient();
        const response = await client.getMerkleProof(txHash);
        return response.Result;
    },

    async getStorage({ contract, key }): Promise<string> {
        const client = getClient();
        const response = await client.getStorage(contract, key);
        return response.Result;
    },

    async getAllowance({ asset, fromAddress, toAddress }): Promise<number> {
        const client = getClient();
        const response = await client.getAllowance(asset, new Address(fromAddress), new Address(toAddress));
        return response.Result;
    },

    async getUnboundOng({ address }) {
        const client = getClient();
        const response = await client.getUnboundong(new Address(address));
        return String(response.Result);
    },
    async getContract({ hash }) {
        const client = getClient();
        const response = await client.getContractJson(hash);
        return response.Result;
    },
    async getSmartCodeEvent({ value }) {
        const client = getClient();
        const response = await client.getSmartCodeEvent(value);
        return response.Result;
    },
    async getBlockHeightByTxHash({ hash }) {
        const client = getClient();
        const response = await client.getBlockHeightByTxHash(hash);
        return response.Result;
    },

    async getBlockHash({ height }) {
        const client = getClient();
        const response = await client.getBlockHash(height);
        return response.Result;
    },
    async getBlockTxsByHeight({ height }) {
        const client = getClient();
        const response = await client.getBlockTxsByHeight(height);
        return response.Result;
    },
    async getGasPrice() {
        const client = getClient();
        const response = await client.getGasPrice();
        return response.Result;
    },
    async getGrantOng({ address }) {
        const client = getClient();
        const response = await client.getGrantOng(new Address(address));
        return String(response.Result);
    },
    async getMempoolTxCount() {
        const client = getClient();
        const response = await client.getMempoolTxCount();
        return response.Result;
    },
    async getMempoolTxState({ hash }) {
        const client = getClient();
        const response = await client.getMempoolTxState(hash);
        return response.Result;
    },
    async getVersion() {
        const client = getClient();
        const response = await client.getVersion();
        return response.Result;
    }
}
