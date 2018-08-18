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
import { Parameter } from 'ontology-dapi';
import { CONST, Crypto, Parameter as OntParameter, ParameterType as OntParameterType, TransactionBuilder } from 'ontology-ts-sdk';
import { decryptAccount } from '../../api/accountApi';
import { getWallet } from '../../api/authApi';
import Address = Crypto.Address;
import { getClient } from '../network';
import { getStore } from '../redux';

export async function scCall(password: string, contract: string, method: string, parameters: Parameter[]) {
  const state = getStore().getState();
  const wallet = getWallet(state.wallet.wallet!);

  const account = wallet.accounts[0].address;
  const privateKey = decryptAccount(wallet, password);

  // convert params
  const params = parameters.map(parameter =>
    new OntParameter(parameter.name, OntParameterType[parameter.type], parameter.value)
  );

  const tx = TransactionBuilder.makeInvokeTransaction(method, params, new Address(contract), '500',
  `${CONST.DEFAULT_GAS_LIMIT}`, account);

  await TransactionBuilder.signTransactionAsync(tx, privateKey);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function scCallRead(contract: string, method: string, parameters: Parameter[]) {
  // convert params
  const params = parameters.map(parameter =>
    new OntParameter(parameter.name, OntParameterType[parameter.type], parameter.value)
  );

  const tx = TransactionBuilder.makeInvokeTransaction(method, params, new Address(contract), '500',
  `${CONST.DEFAULT_GAS_LIMIT}`);

  const client = getClient();
  return await client.sendRawTransaction(tx.serialize(), true, false);
}
