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
import * as Ledger from '@ont-community/ontology-ts-sdk-ledger';
import { Account, Wallet } from 'ontology-ts-sdk';
import { v4 as uuid } from 'uuid';

export async function isLedgerSupported() {
  return await Ledger.isLedgerSupported();
}

export async function importLedgerKey(index: number, neo: boolean) {
  const wallet = Wallet.create(uuid());
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
