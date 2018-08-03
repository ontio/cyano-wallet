import BigNumber from 'bignumber.js';
import { getAddress } from '../../api/authApi';
import { store } from '../redux';
import { Asset } from './types';

/**
 * Gets own address or null of not signed in.
 */
export function getOwnAddress(): string | null {
    const state = store.getState();
    const wallet = state.wallet.wallet;

    if (wallet === null) {
        return null;
    }

    return getAddress(wallet);
}

/**
 * fixme
 */
export async function makeTransfer(recipientAddress: string, asset: Asset, amount: BigNumber): Promise<void> {
    return Promise.resolve();
}
