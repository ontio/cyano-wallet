/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Crypto, Identity, utils } from 'ontology-ts-sdk';
import { v4 as uuid } from 'uuid';
import PrivateKey = Crypto.PrivateKey;
import { getWallet } from './authApi';

export function decryptIdentity(identity: Identity, password: string, scrypt: any) {
  const control = identity.controls[0];
  const saltHex = Buffer.from(control.salt, 'base64').toString('hex');
  const encryptedKey = control.encryptedKey;
  
  return encryptedKey.decrypt(password, control.address, saltHex, {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen
  });
}

export function identitySignUp(password: string, scrypt: any, neo: boolean) {
  const mnemonics = utils.generateMnemonic(32);
  return identityImportMnemonics(mnemonics, password, scrypt, neo);
}

export function identityImportMnemonics(mnemonics: string, password: string, scrypt: any, neo: boolean) {
  const bip32Path = neo ? "m/44'/888'/0'/0/0" : "m/44'/1024'/0'/0/0";
  const privateKey = PrivateKey.generateFromMnemonic(mnemonics, bip32Path);
  const wif = privateKey.serializeWIF();

  const result = identityImportPrivateKey(wif, password, scrypt);

  return {
    mnemonics,
    ...result
  };
}

export function identityImportPrivateKey(wif: string, password: string, scrypt: any) {
  const scryptParams = {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen
  };

  const privateKey = PrivateKey.deserializeWIF(wif);
  const publicKey = privateKey.getPublicKey();

  const identity = Identity.create(privateKey, password, uuid(), scryptParams);
  
  return {
    encryptedWif: identity.controls[0].encryptedKey.serializeWIF(),
    idPk: publicKey.serializeHex(),
    identity,
    ontId: identity.ontid,
    wif
  };
}

export function getIdentity(walletEncoded: string) {
  const wallet = getWallet(walletEncoded);
  if (wallet.defaultOntid !== '') {
    return wallet.defaultOntid;
  } else {
    return null;
  }
}
