import HDKey from '@ont-community/hdkey-secp256r1';
import { decryptAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import { StateChannelLoginRequest } from '../../redux/transactionRequests';
import { getStore } from '../redux';

export async function stateChannelLogin(request: StateChannelLoginRequest, password: string): Promise<string> {
    const state = getStore().getState();
    const wallet = getWallet(state.wallet.wallet!);

    const privateKey = decryptAccount(wallet, password);

    const seed = privateKey.key;
    const hdk = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    const path = "m/44'/1024'/0'/0/0";
    const derive = hdk.derive(path);
    const derivedPrv = Buffer.from(derive.privateKey).toString('hex');

    return derivedPrv;
}