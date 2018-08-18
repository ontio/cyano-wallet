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

// tslint:disable-next-line:no-empty-interface
export interface SmartContractState {}
export const SC_CALL = 'SC_CALL';
export const SC_CALL_READ = 'SC_CALL_READ';

export const scCall = (password: string, contract: string, method: string, parameters: any[], requestId: string) => ({
  contract,
  method,
  parameters,
  password,
  requestId,
  type: SC_CALL
});

export const scCallRead = (contract: string, method: string, parameters: any[], requestId: string) => ({
  contract,
  method,
  parameters,
  requestId,
  type: SC_CALL_READ
});
