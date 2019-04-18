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

export async function signUp(nodeAddress: string, ssl: boolean, password: string, wallet: object | null) {
  const mnemonics = utils.generateMnemonic(32);
  return await importMnemonics(nodeAddress, ssl, mnemonics, password, true, wallet);
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
  console.log(currentWallet.defaultAccountAddress, pk, currentWallet.defaultAccountAddress === pk);

  return currentWallet.defaultAccountAddress === pk;
}

export async function importMnemonics(
  nodeAddress: string,
  ssl: boolean,
  mnemonics: string,
  password: string,
  register: boolean,
  wallet: object | null
) {
  // generate NEO address for now
  const privateKey = PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0");
  const wif = privateKey.serializeWIF();

  const result = await importPrivateKey(nodeAddress, ssl, wif, password, register, wallet);

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
  register: boolean,
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
  // const publicKey = privateKey.getPublicKey();

  // const identity = Identity.create(privateKey, password, uuid(), scryptParams);
  // const ontId = identity.ontid;

  // register the ONYX ID on blockchain
  // if (register) {
  //   const tx = OntidContract.buildRegisterOntidTx(ontId, publicKey, '0', '30000');
  //   tx.payer = identity.controls[0].address;
  //   await TransactionBuilder.signTransactionAsync(tx, privateKey);

  //   const protocol = ssl ? 'wss' : 'ws';
  //   const client = new WebsocketClient(`${protocol}://${nodeAddress}:${CONST.HTTP_WS_PORT}`, true);
  //   await client.sendRawTransaction(tx.serialize(), false, true);
  // }

  const account = Account.create(privateKey, password, uuid(), scryptParams);

  // wallet.addIdentity(identity);
  currentWallet.addAccount(account);
  // wallet.setDefaultIdentity(identity.ontid);
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
