import { Crypto, utils } from 'ontology-ts-sdk';
import Address = Crypto.Address;

export function strToHex(str: string) {
    return utils.str2hexstr(str);
}

export function hexToStr(hex: string) {
    return utils.hexstr2str(hex);
}

export function addressToHex(str: string) {
    return new Address(str).toHexString();
}

export function hexToAddress(str: string) {
    return new Address(str).toBase58();
}

export function isAddress(str: string) {
    try {
        const address = new Address(str);
        const encoded = address.toBase58();
        return str === encoded;
    } catch (e) {
        return false;
    }
}
