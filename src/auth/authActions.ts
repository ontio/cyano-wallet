import { Crypto, Identity, OntidContract, TransactionBuilder, Wallet, WebsocketClient } from 'ont-sdk-ts';
import { Dispatch } from 'redux';
import {v4 as uuid } from 'uuid';
import { finishLoading, startLoading } from '../loader/loaderActions';
import PrivateKey = Crypto.PrivateKey;

const client = new WebsocketClient();

let storageGet: (key: string) => Promise<string | null>;
let storageSet: (key: string, value: string) => Promise<void>;


if (typeof browser === 'undefined') {
    storageGet = (key) => {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
    };

    storageSet = (key, value) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
    }
} else {
    storageGet = async (key) => {
        const result = await browser.storage.local.get([key]);
        return result[key] as string | null;
    };

    storageSet = async (key, value) => {
        await browser.storage.local.set({ [key]: value });
        return Promise.resolve();
    }
}

export const SIGN_IN = 'SIGN_IN';

export function signIn(password: string) {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());

        try {
            const walletEncoded = await storageGet('wallet');
            
            if (walletEncoded === null) {
                throw new Error('Wallet data not found.');
            }

            dispatch({ type: SIGN_IN, wallet: JSON.parse(walletEncoded), password });
        } finally {
            dispatch(finishLoading());
        }
    };
}

export function signUp(password: string) {
    return async (dispatch: Dispatch) => {
        dispatch(startLoading());

        try {
            const identity = await createIdentity(password);

            const wallet = Wallet.create(uuid());
            wallet.addIdentity(identity);
            wallet.setDefaultIdentity(identity.ontid);

            
            await storageSet('wallet', wallet.toJson());
            
            dispatch({ type: SIGN_IN, wallet: wallet.toJsonObj(), password });
        } finally {
            dispatch(finishLoading());
        }
    };
}

export async function createIdentity(password: string) {
    // generate new ONT ID
    const privateKey = PrivateKey.random();
    const publicKey = privateKey.getPublicKey();

    const identity = Identity.create(privateKey, password, uuid());
    const ontId = identity.ontid;

    // register the ONT ID on blockchain
    const tx = OntidContract.buildRegisterOntidTx(ontId, publicKey, '0', '30000');
    tx.payer = identity.controls[0].address;
    TransactionBuilder.signTransaction(tx, privateKey);

    await client.sendRawTransaction(tx.serialize(), false, true);
    
    return identity;
}

export async function hasStoredWallet() {
    const walletEncoded = await storageGet('wallet');

    return walletEncoded != null;
}
