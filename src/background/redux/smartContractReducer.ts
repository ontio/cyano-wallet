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
import { timeout, TimeoutError } from 'promise-timeout';
import { Dispatch, Reducer } from 'redux';
import Actions from '../../redux/actions';
import { SC_CALL, SC_CALL_READ, SmartContractState } from '../../redux/smartContract';
import { scCall, scCallRead } from '../api/smartContractApi';

const defaultState: SmartContractState = {};

// tslint:disable:no-console
export const smartContractReducer: Reducer<SmartContractState> = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const smartContractAliases = {
  [SC_CALL]: (action: any) => {
    return async (dispatch: Dispatch) => {
      const contract: string = action.contract;
      const method: string = action.method;
      const parameters: Parameter[] = action.parameters;
      const password: string = action.password;
      const requestId: string = action.requestId;
      const gasPrice: number = action.gasPrice;
      const gasLimit: number = action.gasLimit;

      try {
        const result = await timeout(scCall(password, contract, method, parameters, gasPrice, gasLimit), 15000);

        // resolves request
        dispatch(Actions.transactionRequests.resolveRequest(requestId, undefined, result));
      } catch (e) {
        if (e instanceof TimeoutError) {
          // resolves request
          dispatch(Actions.transactionRequests.resolveRequest(requestId, 'TIMEOUT'));
        } else {
          // resolves request
          dispatch(Actions.transactionRequests.resolveRequest(requestId, 'OTHER'));
        }
      }
    };
  },
  [SC_CALL_READ]: (action: any) => {
    return async (dispatch: Dispatch) => {
      const contract: string = action.contract;
      const method: string = action.method;
      const parameters: Parameter[] = action.parameters;
      const requestId: string = action.requestId;

      try {
        const result = await timeout(scCallRead(contract, method, parameters), 15000);

        // resolves request
        dispatch(Actions.transactionRequests.resolveRequest(requestId, undefined, result));
      } catch (e) {
        if (e instanceof TimeoutError) {
          // resolves request
          dispatch(Actions.transactionRequests.resolveRequest(requestId, 'TIMEOUT'));
        } else {
          // resolves request
          dispatch(Actions.transactionRequests.resolveRequest(requestId, 'WRONG_PASSWORD'));
        }
      }
    };
  },
};
