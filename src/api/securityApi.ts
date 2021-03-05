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

import axios from 'axios';

export interface EnhanceSecurityParams {
  contract: string;
  method: string;
  payer: string;
}

export const ENHANCE_SECURITY_BACKEND_MAP = {
  MAIN: 'https://api.wing.finance/wing',
  // TEST: 'http://106.75.209.209:60018',
}

export const request = axios.create({
  headers: { 'content-type': 'application/json' },
});

export async function getUnsafeAccounts(accounts: string[], net: string) {
  const baseURL = ENHANCE_SECURITY_BACKEND_MAP[net];
  if (!baseURL) {
    return [];
  }
  const response = await request({
    baseURL,
    data: {
      addressList: accounts
    },
    method: 'post',
    url: '/common/check-approval',
  });
  return response.data.result as string[];
}

export async function getEnhanceSecurityParams(net: string) {
  const baseURL = ENHANCE_SECURITY_BACKEND_MAP[net];
  if (!baseURL) {
    return null;
  }
  const response = await request({
    baseURL,
    method: 'get',
    url: '/common/cancel-approval-info',
  });
  return response.data.result as EnhanceSecurityParams;
}
