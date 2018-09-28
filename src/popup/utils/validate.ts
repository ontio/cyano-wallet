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
import { get } from 'lodash';
import { utils } from 'ontology-ts-sdk';
export function validMnemonics(value: string) {
  try {
    utils.parseMnemonic(value);
    return false;
  } catch (e) {
    return true;
  }
};

export function samePassword(values: object) {
  const password = get(values, 'password', '');
  const passwordAgain = get(values, 'passwordAgain', '');

  if (password !== passwordAgain) {
    return {
      passwordAgain: "Password does not match"
    }
  }

  return {};
}

export function required(value: string){ 
  return (value === undefined || value.trim().length === 0);
}

export function range(from: number, to: number){ 
  return function rangeCheck(value: string){ 
    if (value === undefined) {
      return true;
    } 

    const val = Number(value);
    return (val <= from || val > to);
  }
}

export function gt(than: number){ 
  return function gtCheck(value: string){ 
    if (value === undefined) {
      return true;
    } 

    const val = Number(value);
    return (val <= than);
  }
}

export function gte(than: number){ 
  return function gtCheck(value: string){ 
    if (value === undefined) {
      return true;
    } 

    const val = Number(value);
    return (val < than);
  }
}
