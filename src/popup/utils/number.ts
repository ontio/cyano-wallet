import BigNumber from 'bignumber.js';
import { AssetType } from '../../redux/runtime';

export function convertAmountToBN(amount: number | undefined, asset: AssetType | 'NEP') {
    if (amount === undefined) {
        return new BigNumber(0);
    }

    let amountBN = new BigNumber(amount);
    
    if (asset === 'ONG') {
        amountBN = amountBN.div(new BigNumber('1000000000'));
    } else if (asset === 'NEP') {
        amountBN = amountBN.div(new BigNumber('100000000'));
    }
    return amountBN;
}

export function convertAmountFromStr(amount: string, asset: AssetType | 'NEP') {
    let amountBN = new BigNumber(amount);
    if (asset === 'ONG') {
        amountBN = amountBN.times(new BigNumber('1000000000'));
    } else if (asset === 'NEP') {
        amountBN = amountBN.times(new BigNumber('100000000'));
    }

    return amountBN.toNumber();
}

export function convertAmountToStr(amount: number | undefined, asset: AssetType | 'NEP') {
    return convertAmountToBN(amount, asset).toString();
}

export function encodeAmount(amount: string, decimals: number) {
  let amountBN = new BigNumber(amount);
  amountBN = amountBN.shiftedBy(decimals);

  return amountBN.toString();
}

export function decodeAmount(amount: string, decimals: number) {
  let amountBN = new BigNumber(amount);
  amountBN = amountBN.shiftedBy(-decimals);

  return amountBN.toString();
}
  