import { Account, Crypto, utils, Wallet } from "ontology-ts-sdk";
import { v4 as uuid } from "uuid";
import PrivateKey = Crypto.PrivateKey;
import { storageClear, storageGet, storageSet } from "./storageApi";

export async function clear() {
  await storageClear("wallet");
}

export function decryptWallet(wallet: Wallet, password: string) {
  const account = wallet.accounts[0];
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

export async function signIn(password: string) {
  const walletEncoded = await storageGet("wallet");

  if (walletEncoded === null) {
    throw new Error("Wallet data not found.");
  }

  try {
    const wallet = Wallet.parseJson(walletEncoded);
    decryptWallet(wallet, password);
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.log(e);
    throw new Error("Error during wallet decryption.");
  }

  return walletEncoded;
}

export async function signUp() {
  const mnemonics = utils.generateMnemonic(32);
  const wif = PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0").serializeWIF();
  return { mnemonics, wif };
}

export async function createAccount(nodeAddress, ssl, mnemonics, password, wallet) {
  return importMnemonics(nodeAddress, ssl, mnemonics, password, wallet);
}

export function isCurrentUserMnemonics(mnemonics: string, wallet: object | null) {
  let currentWallet: Wallet;
  if (wallet === null) {
    currentWallet = Wallet.create(uuid());
  } else {
    currentWallet = Wallet.parseJsonObj(wallet);
  }
  const privateKey = PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0");
  const account = Account.create(privateKey, uuid(), uuid());
  const pk = account.address.toBase58();

  return currentWallet.defaultAccountAddress === pk;
}

export async function importMnemonics(
  nodeAddress: string,
  ssl: boolean,
  mnemonics: string,
  password: string,
  wallet: object | null
) {

  const privateKey = PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0");
  const wif = privateKey.serializeWIF();

  const result = await importPrivateKey(nodeAddress, ssl, wif, password, wallet);

  return {
    mnemonics,
    ...result
  };
}

export async function importPrivateKey(
  nodeAddress: string,
  ssl: boolean,
  wif: string,
  password: string,
  wallet: object | null
) {
  let currentWallet: Wallet;
  if (wallet === null) {
    currentWallet = Wallet.create(uuid());
  } else {
    currentWallet = Wallet.parseJsonObj(wallet);
  }

  const scrypt = currentWallet.scrypt;
  const scryptParams = {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen
  };

  const privateKey = PrivateKey.deserializeWIF(wif);

  const account = Account.create(privateKey, password, uuid(), scryptParams);

  currentWallet.addAccount(account);
  currentWallet.setDefaultAccount(account.address.toBase58());

  await storageSet("wallet", currentWallet.toJson());

  return {
    encryptedWif: account.encryptedKey.serializeWIF(),
    wallet: currentWallet.toJson(),
    wif
  };
}

export function accountDelete(address: string, wallet: string | Wallet) {
  if (typeof wallet === "string") {
    wallet = getWallet(wallet);
  } else {
    wallet = Wallet.parseJsonObj(wallet);
  }

  const account = wallet.accounts.find(a => a.address.toBase58() === address);

  if (account !== undefined) {
    wallet.accounts = wallet.accounts.filter(a => a.address.toBase58() !== address);
  }

  if (wallet.defaultAccountAddress === address) {
    wallet.defaultAccountAddress = wallet.accounts.length > 0 ? wallet.accounts[0].address.toBase58() : "";
  }

  return {
    wallet: wallet.toJson()
  };
}

export async function getStoredWallet() {
  const walletEncoded = await storageGet("wallet");

  return walletEncoded;
}

export function getWallet(walletEncoded: any) {
  if (walletEncoded == null) {
    throw new Error("Missing wallet data.");
  }
  return Wallet.parseJsonObj(walletEncoded);
}

export function getAddress(walletEncoded: any) {
  const wallet = getWallet(walletEncoded);
  return wallet.defaultAccountAddress;
}

export function encodeWallet(wallet: Wallet) {
  return wallet.toJson();
}
