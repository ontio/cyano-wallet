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

    try {
        const wallet = Wallet.parseJson(walletEncoded);
        const account = wallet.accounts[0];
        const saltHex = Buffer.from(account.salt, 'base64').toString('hex');
        const encryptedKey = account.encryptedKey;
        const scrypt = wallet.scrypt;

        encryptedKey.decrypt(password, account.address, saltHex, {
            blockSize: scrypt.r,
            cost: scrypt.n,
            parallel: scrypt.p,
            size: scrypt.dkLen
        });
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e);
        throw new Error('Error during wallet decryption.');
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
    const wallet = Wallet.create(uuid());
    const scrypt = wallet.scrypt;
    const scryptParams = {
        blockSize: scrypt.r,
        cost: scrypt.n,
        parallel: scrypt.p,
        size: scrypt.dkLen
    };

    const privateKey = PrivateKey.deserializeWIF(wif);
    const publicKey = privateKey.getPublicKey();
    

    const identity = Identity.create(privateKey, password, uuid(), scryptParams);
    const ontId = identity.ontid;

    // register the ONT ID on blockchain
    if (register) {
        const tx = OntidContract.buildRegisterOntidTx(ontId, publicKey, '0', '30000');
        tx.payer = identity.controls[0].address;
        TransactionBuilder.signTransaction(tx, privateKey);

        await client.sendRawTransaction(tx.serialize(), false, true);
    }

    const account = Account.create(privateKey, password, uuid(), scryptParams);

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

export async function hasStoredWallet() {
    const walletEncoded = await storageGet('wallet');

    return walletEncoded != null;
}
