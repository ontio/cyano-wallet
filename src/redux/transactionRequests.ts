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
import { AssetType } from './runtime';

export type ErrorCode = 'TIMEOUT' | 'WRONG_PASSWORD' | 'CANCELED' | 'OTHER';

export type TransactionType = 'transfer' | 'sc_call' | 'sc_call_read';

export interface TransactionRequest {
  id: string;
  type: TransactionType;
  resolved: boolean;
  error?: ErrorCode;
  result?: any;
}

export interface TransferRequest extends TransactionRequest {
  sender: string;
  recipient: string;
  amount: number;
  asset: AssetType;
}

export interface ScCallRequest extends TransactionRequest {
  account: string;
  contract: string;
  method: string;
  gasPrice: number;
  gasLimit: number;
  addresses: string[];
  parameters: Parameter[];
}

export interface ScCallReadRequest extends TransactionRequest {
  contract: string;
  method: string;
  parameters: Parameter[];
}

export interface TransactionRequestsState {
  requests: TransactionRequest[];
}

export const ADD_TRANSACTION_REQUEST = 'ADD_TRANSACTION_REQUEST';
export const RESOLVE_TRANSACTION_REQUEST = 'RESOLVE_TRANSACTION_REQUEST';

export const addRequest = (request: TransactionRequest) => ({
  request,
  type: ADD_TRANSACTION_REQUEST
});

export const resolveRequest = (id: string, error?: ErrorCode, result?: any) => ({
  error,
  id,
  result,
  type: RESOLVE_TRANSACTION_REQUEST
});
