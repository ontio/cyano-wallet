import BigNumber from 'bignumber.js';
import { Asset, Network } from './types';

/**
 * fixme
 */
export function isConnected(): boolean {
    return false;
}

/**
 * fixme
 */
export function getNetwork(): Network {
    return 'MAIN';
}

/**
 * fixme
 */
export function getOwnAddress(): string {
    return '';
}

/**
 * fixme
 */
export async function makeTransfer(recipientAddress: string, asset: Asset, amount: BigNumber): Promise<void> {
    return Promise.resolve();
}
