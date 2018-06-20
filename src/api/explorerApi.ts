import axios from 'axios';
import { flatMap, get } from 'lodash';

type AssetType = 'ONT' | 'ONG';

export interface Transfer {
  amount: string;
  asset: AssetType;
  from: string;
  to: string;
  time: number;
}

export async function getTransferList(address: string) {
  const url = `https://explorer.ont.io/api/v1/explorer/address/${address}/100/1`;

  const response = await axios.get(url);

  const txnList: any[] = get(response.data, 'Result.TxnList', []);

  return flatMap(
    txnList.map(tx => {
      const txnTime: number = get(tx, 'TxnTime', 0);
      const transferList: any[] = get(tx, 'TransferList', []);

      return transferList.map(transfer => ({
        amount: get(transfer, 'Amount', '0'),
        asset: translateAsset(get(transfer, 'AssetName')),
        from: get(transfer, 'FromAddress'),
        time: txnTime,
        to: get(transfer, 'ToAddress')
      }) as Transfer);
    })
  );
}

function translateAsset(asset: any): AssetType {
  if (asset === 'ont') {
    return 'ONT';
  } else if (asset === 'ong') {
    return 'ONG';
  } else {
    return 'ONT';
  }
}