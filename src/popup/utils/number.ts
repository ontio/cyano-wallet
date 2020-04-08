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

export function scientificToNumber(num: string) {
    const numberHasSign = num.startsWith("-") || num.startsWith("+");
    const signStr = numberHasSign ? num[0] : "";
    num = numberHasSign ? num.replace(signStr, "") : num;
    
    const SCIENTIFIC_NUMBER_REGEX = /\d+\.?\d*e[\+\-]*\d+/i;
    // if the number is in scientific notation remove it
    if (SCIENTIFIC_NUMBER_REGEX.test(num)) {
      const zero = '0';
      const parts = String(num).toLowerCase().split('e'); // split into coeff and exponent
      const e = Number(parts.pop());// store the exponential part
      let l = Math.abs(e); // get the number of zeros
      const sign = e / l;
      const coeffArray = parts[0].split('.');
  
      if (sign === -1) {
        coeffArray[0] = String(Math.abs(Number(coeffArray[0])));
        num = zero + '.' + new Array(l).join(zero) + coeffArray.join('');
      } else {
        const dec = coeffArray[1];
        if (dec) { l = l - dec.length; }
        num = coeffArray.join('') + new Array(l + 1).join(zero);
      }
    }
  
    return signStr + num; 
  };