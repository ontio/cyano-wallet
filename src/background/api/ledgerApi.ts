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
import * as Ledger from '@ont-dev/ontology-ts-sdk-ledger';
import { Account, Wallet } from 'ontology-ts-sdk';
import { v4 as uuid } from 'uuid';
import { getWallet } from '../../api/authApi';

export async function isLedgerSupported() {
  return await Ledger.isLedgerSupported();
}

export async function importLedgerKey(index: number, neo: boolean, wallet: string | Wallet | null) {
  if (wallet === null) {
    wallet = Wallet.create(uuid());
  } else if (typeof wallet === 'string') {
    wallet = getWallet(wallet);
  }

  const scrypt = wallet.scrypt;
  const scryptParams = {
    blockSize: scrypt.r,
    cost: scrypt.n,
    parallel: scrypt.p,
    size: scrypt.dkLen,
  };

  const privateKey = await Ledger.create(index, neo);

  const account = Account.create(privateKey, '', uuid(), scryptParams);

  wallet.addAccount(account);
  wallet.setDefaultAccount(account.address.toBase58());

  return {
    wallet: wallet.toJson(),
  };
}
