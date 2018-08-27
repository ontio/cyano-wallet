import 'babel-polyfill';
import { Crypto } from 'ontology-ts-sdk';
import Address = Crypto.Address;
import PrivateKey = Crypto.PrivateKey;
import { constructNepTransfer, signTransaction } from '../src/background/api/neoApi';

const NEO_TRAN = 100000000;

// tslint:disable : no-console
describe('test NEP-5 sign', () => {

    test('nep-5 sign', async () => {
        const mnemonics = 'immune annual decorate major humble surprise dismiss trend edit suit alert uncover release transfer suit torch small timber lock mind tomorrow north lend diet';
        const privateKey = PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0");
        const publicKey = privateKey.getPublicKey();
        const address = Address.fromPubKey(publicKey);

        const swapAddress = 'AFmseVrdL9f9oyCzZefL9tG6UbvhPbdYzM';
        const to = new Address(swapAddress);

        const tx = constructNepTransfer(address, to, 1 * NEO_TRAN);
        tx.attributes[1].data = 'f6e9b4e1b1af39f4b53cf5a726bf8f97';

        await signTransaction(tx, privateKey);
        console.log('transaction', tx);
    });
});
