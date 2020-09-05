/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import { get } from 'lodash';
import { Crypto, Identity, utils, Wallet } from 'ontology-ts-sdk';
import { v4 as uuid } from 'uuid';
import { deserializePrivateKey } from './accountApi';
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
    size: scrypt.dkLen,
  });
}

export function decryptDefaultIdentity(wallet: Wallet, password: string, scrypt: any) {
  const ontId = wallet.defaultOntid !== '' ? wallet.defaultOntid : null;

  if (ontId === null)  {
    throw new Error('Default identity not found in wallet');
  }

  const identity = wallet.identities.find((i) => i.ontid === ontId);

  if (identity === undefined) {
    throw new Error(`Identity ${ontId} not found in the wallet.`);
  }

  return decryptIdentity(identity, password, scrypt);
}

export function hasIdentity(wallet: Wallet) {
  return wallet.identities.length > 0;
}

export function getDefaultIdentity(wallet: Wallet) {
  const ontId = wallet.defaultOntid !== '' ? wallet.defaultOntid : null;

  if (ontId === null)  {
    if (wallet.identities.length > 0) {
      return wallet.identities[0];
    } else {
      throw new Error('No identities found.');
    }
  }

  const identity = wallet.identities.find((i) => i.ontid === ontId);

  if (identity === undefined) {
    throw new Error(`Identity ${ontId} not found in the wallet.`);
  }

  return identity;
}

export function isIdentityLedgerKey(wallet: Wallet) {
  return get(getDefaultIdentity(wallet).controls[0].encryptedKey, 'type') === 'LEDGER';
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
    ...result,
  };
}

export function identityImportPrivateKey(privateKeyStr: string, password: string, scrypt: any) {
  const scryptParams = {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen,
  };

  let privateKey: PrivateKey;

  if (privateKeyStr.length === 52) {
    privateKey = PrivateKey.deserializeWIF(privateKeyStr);
  } else {
    privateKey = deserializePrivateKey(privateKeyStr);
  }

  const publicKey = privateKey.getPublicKey();

  const identity = Identity.create(privateKey, password, uuid(), scryptParams);

  return {
    encryptedWif: identity.controls[0].encryptedKey.serializeWIF(),
    idPk: publicKey.serializeHex(),
    identity,
    ontId: identity.ontid,
    wif: privateKey.serializeWIF(),
  };
}

export function identityDelete(ontId: string, wallet: string | Wallet) {
  if (typeof wallet === 'string') {
    wallet = getWallet(wallet);
  }

  const identity = wallet.identities.find((i) => i.ontid === ontId);

  if (identity !== undefined) {
    wallet.identities = wallet.identities.filter((i) => i.ontid !== ontId);
  }

  if (wallet.defaultOntid === ontId) {
    wallet.defaultOntid = wallet.identities.length > 0 ? wallet.identities[0].ontid : '';
  }

  return {
    wallet: wallet.toJson(),
  };
}

export function getIdentity(wallet: string | Wallet) {
  if (typeof wallet === 'string') {
    wallet = getWallet(wallet);
  }

  if (wallet.defaultOntid !== '') {
    return wallet.defaultOntid;
  } else {
    return null;
  }
}
