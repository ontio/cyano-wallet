import { Account, Crypto, Identity, OntidContract, TransactionBuilder, utils, Wallet, WebsocketClient } from 'ont-sdk-ts';
import { v4 as uuid } from 'uuid';
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

export async function signIn(password: string) {
    const walletEncoded = await storageGet('wallet');

    if (walletEncoded === null) {
        throw new Error('Wallet data not found.');
    }

    return walletEncoded;
}

export async function signUp(password: string) {
    const mnemonics = utils.generateMnemonic();
    return await importMnemonics(mnemonics, password, true);
}

export async function importMnemonics(mnemonics: string, password: string, register: boolean) {
    const privateKey = PrivateKey.generateFromMnemonic(mnemonics);
    const wif = privateKey.serializeWIF();

    const result = await importPrivateKey(wif, password, register);
    
    return {
        mnemonics,
        ...result
    };
}

export async function importPrivateKey(wif: string, password: string, register: boolean) {
    const privateKey = PrivateKey.deserializeWIF(wif);
    const publicKey = privateKey.getPublicKey();

    const identity = Identity.create(privateKey, password, uuid());
    const ontId = identity.ontid;

    // register the ONT ID on blockchain
    if (register) {
        const tx = OntidContract.buildRegisterOntidTx(ontId, publicKey, '0', '30000');
        tx.payer = identity.controls[0].address;
        TransactionBuilder.signTransaction(tx, privateKey);

        await client.sendRawTransaction(tx.serialize(), false, true);
    }

    const account = createAccount(wif, password);

    const wallet = Wallet.create(uuid());
    wallet.addIdentity(identity);
    wallet.addAccount(account);
    wallet.setDefaultIdentity(identity.ontid);
    wallet.setDefaultAccount(account.address.toBase58());

    await storageSet('wallet', wallet.toJson());

    return {
        encryptedWif: account.encryptedKey.serializeWIF(),
        wallet: wallet.toJson(),
        wif
    };
}

export function createAccount(wif: string, password: string) {
    const privateKey = PrivateKey.deserializeWIF(wif);

    return Account.create(privateKey, password, uuid());
}

export async function hasStoredWallet() {
    const walletEncoded = await storageGet('wallet');

    return walletEncoded != null;
}
