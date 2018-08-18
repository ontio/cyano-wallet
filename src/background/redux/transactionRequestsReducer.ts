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
import { Reducer } from 'redux';
import {
  ADD_TRANSACTION_REQUEST,
  RESOLVE_TRANSACTION_REQUEST,
  TransactionRequestsState,
} from '../../redux/transactionRequests';

const defaultState: TransactionRequestsState = { requests: [] };

export const transactionRequestsReducer: Reducer<TransactionRequestsState> = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TRANSACTION_REQUEST:
      return { ...state, requests: [...state.requests, action.request] };
    case RESOLVE_TRANSACTION_REQUEST:
      return {
        ...state,
        requests: [
          ...state.requests.filter((r) => r.id !== action.id),
          {
            ...state.requests.find((r) => r.id === action.id),
            error: action.error,
            resolved: true,
            result: action.result
          },
        ],
      };
    default:
      return state;
  }
};
