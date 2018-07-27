import BigNumber from 'bignumber.js';
import { Crypto } from 'ontology-ts-sdk';
import { getClient } from '../network';
import { Asset, Block, MerkleProof, Transaction } from './types';
import Address = Crypto.Address;

export async function getBalance(address: string, asset: Asset): Promise<BigNumber> {
    const client = getClient();
    const response = await client.getBalance(new Address(address));
    return response.Result[asset];
}

export async function getBlock(block: number | string): Promise<Block> {
    const client = getClient();
    const response = await client.getBlockJson(block);
    return response.Result;
}

export async function getTransaction(txHash: string): Promise<Transaction> {
    const client = getClient();
    const response = await client.getRawTransactionJson(txHash);
    return response.Result;
}

export async function getGenerateBlockTime(): Promise<number | null> {
    const client = getClient();
    const response = await client.getGenerateBlockTime();
    return response.Result;
}

export async function getNodeCount(): Promise<number> {
    const client = getClient();
    const response = await client.getNodeCount();
    return response.Result;
}

export async function getBlockHeight(): Promise<number> {
    const client = getClient();
    const response = await client.getBlockHeight();
    return response.Result;
}

export async function getMerkleProof(txHash: string): Promise<MerkleProof> {
    const client = getClient();
    const response = await client.getMerkleProof(txHash);
    return response.Result;
}

export async function getStorage(constractAddress: string, key: string): Promise<string> {
    const client = getClient();
    const response = await client.getStorage(constractAddress, key);
    return response.Result;
}

export async function getAllowance(asset: Asset, fromAddress: string, toAddress: string): Promise<BigNumber> {
    const client = getClient();
    const response = await client.getAllowance(asset, new Address(fromAddress), new Address(toAddress));
    return response.Result;
}
