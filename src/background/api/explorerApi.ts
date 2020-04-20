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
import { flatMap, get, orderBy } from 'lodash';
import { AssetType, Transfer } from '../../redux/runtime';
import { getExplorerAddress } from '../network';

export async function getTransferList(address: string) {
  const explorerAddress = getExplorerAddress();
  if (explorerAddress === null) {
    return [];
  }
  
//   const url = `https://${explorerAddress}/api/v1/explorer/address/${address}/100/1`;
    const url = `https://${explorerAddress}/v2/addresses/${address}/transactions?page_size=20&page_number=1`;

  const response = await axios.get(url);

  const txnList: any[] = get(response.data, 'result', []);

  const transfers = flatMap(
    txnList.map(tx => {
      const txnTime: number = get(tx, 'tx_time', 0);
      const transferList: any[] = get(tx, 'transfers', []);

      return transferList.map(transfer => ({
        amount: get(transfer, 'amount', '0'),
        asset: translateAsset(get(transfer, 'asset_name')),
        from: get(transfer, 'from_address'),
        time: txnTime,
        to: get(transfer, 'to_address')
      }) as Transfer);
    })
  );
  return orderBy(transfers, 'time', 'desc');
}

function translateAsset(asset: any): AssetType {
  if (asset === 'ont') {
    return 'ONT';
  } else if (asset === 'ong') {
    return 'ONG';
  } else {
    return asset;
  }
}