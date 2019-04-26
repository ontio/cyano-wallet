// import { get } from "lodash";
import { Reader } from "ontology-ts-crypto";
import { Account, Crypto, utils, Wallet } from "ontology-ts-sdk";
import { v4 as uuid } from "uuid";
import PrivateKey = Crypto.PrivateKey;
import KeyParameters = Crypto.KeyParameters;
import KeyType = Crypto.KeyType;
import CurveLabel = Crypto.CurveLabel;
import { getWallet } from "./authApi";

export function checkAccountPassword(wallet: Wallet | null, password: string) {
  if (wallet === null) {
    throw new Error("NO_ACCOUNT");
  }

  try {
    const decodedWallet = getWallet(wallet);
    decryptAccount(decodedWallet, password);

    return true;
  } catch (e) {
    return false;
  }
}

export function decryptAccount(wallet: Wallet, password: string) {
  const account = getAccount(wallet);
  const saltHex = Buffer.from(account.salt, "base64").toString("hex");
  const encryptedKey = account.encryptedKey;
  const scrypt = wallet.scrypt;

  return encryptedKey.decrypt(password, account.address, saltHex, {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen
  });
}

export function accountSignUp(password: string, neo: boolean, wallet: string | Wallet | null) {
  const mnemonics = utils.generateMnemonic(32);
  return accountImportMnemonics(mnemonics, password, neo, wallet);
}

export function accountImportMnemonics(
  mnemonics: string,
  password: string,
  neo: boolean,
  wallet: string | Wallet | null
) {
  const bip32Path = neo ? "m/44'/888'/0'/0/0" : "m/44'/1024'/0'/0/0";
  const privateKey = PrivateKey.generateFromMnemonic(mnemonics, bip32Path);
  const wif = privateKey.serializeWIF();

  const result = accountImportPrivateKey(wif, password, wallet);

  return {
    mnemonics,
    ...result
  };
}

export function accountImportPrivateKey(
  privateKeyStr: string,
  password: string,
  wallet: string | Wallet | null
) {
  if (wallet === null) {
    wallet = Wallet.create(uuid());
  } else {
    wallet = getWallet(wallet);
  }

  const scrypt = wallet.scrypt;
  const scryptParams = {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen
  };

  let privateKey: PrivateKey;

  if (privateKeyStr.length === 52) {
    privateKey = PrivateKey.deserializeWIF(privateKeyStr);
  } else {
    privateKey = deserializePrivateKey(privateKeyStr);
  }

  const account = Account.create(privateKey, password, uuid(), scryptParams);

  wallet.addAccount(account);
  wallet.setDefaultAccount(account.address.toBase58());

  return {
    encryptedWif: account.encryptedKey.serializeWIF(),
    wallet: wallet.toJson(),
    wif: privateKey.serializeWIF()
  };
}

export function accountDelete(address: string, wallet: string | Wallet) {
  if (typeof wallet === "string") {
    wallet = getWallet(wallet);
  }

  const account = wallet.accounts.find(a => a.address.toBase58() === address);

  if (account !== undefined) {
    wallet.accounts = wallet.accounts.filter(a => a.address.toBase58() !== address);
  }

  if (wallet.defaultAccountAddress === address) {
    wallet.defaultAccountAddress =
      wallet.accounts.length > 0 ? wallet.accounts[0].address.toBase58() : "";
  }

  return {
    wallet: wallet.toJson()
  };
}

export function getAccount(wallet: string | Wallet) {
  if (typeof wallet === "string") {
    wallet = getWallet(wallet);
  }

  const defaultAddress = wallet.defaultAccountAddress;

  if (defaultAddress != null) {
    const account = wallet.accounts.find(a => a.address.toBase58() === defaultAddress);

    if (account === undefined) {
      throw new Error("Default account not found in wallet");
    }
    return account;
  } else {
    return wallet.accounts[0];
  }
}

export function getAddress(wallet: string | Wallet) {
  const account = getAccount(wallet);
  return account.address.toBase58();
}

export function getPublicKey(walletEncoded: string) {
  const wallet = getWallet(walletEncoded);

  const account = wallet.accounts.find(a => a.address.toBase58() === wallet.defaultAccountAddress);
  if (account !== undefined) {
    return account.publicKey;
  } else {
    return "";
  }
}

export function deserializePrivateKey(str: string): PrivateKey {
  const b = new Buffer(str, "hex");
  const r = new Reader(b);

  if (b.length === 32) {
    // ECDSA
    const algorithm = KeyType.ECDSA;
    const curve = CurveLabel.SECP256R1;
    const sk = r.readBytes(32);
    return new PrivateKey(sk.toString("hex"), algorithm, new KeyParameters(curve));
  } else {
    const algorithmHex = r.readByte();
    const curveHex = r.readByte();
    const sk = r.readBytes(32);

    return new PrivateKey(
      sk.toString("hex"),
      KeyType.fromHex(algorithmHex),
      new KeyParameters(CurveLabel.fromHex(curveHex))
    );
  }
}
