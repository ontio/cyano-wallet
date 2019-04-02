import BigNumber from "bignumber.js";
import { AssetType } from "../redux/runtime";

export function convertAmountToBN(amount: number | undefined, asset: AssetType) {
  if (amount === undefined) {
    return new BigNumber(0);
  }

  let amountBN = new BigNumber(amount);

  if (asset === "OXG") {
    amountBN = amountBN.div(new BigNumber(Math.pow(10, 9)));
  } else if (asset === "ONYX") {
    amountBN = amountBN.div(new BigNumber(Math.pow(10, 8)));
  }
  return amountBN;
}

export function convertAmountFromStr(amount: string, asset: AssetType) {
  let amountBN = new BigNumber(amount);
  if (asset === "OXG") {
    amountBN = amountBN.times(new BigNumber(Math.pow(10, 9)));
  } else if (asset === "ONYX") {
    amountBN = amountBN.times(new BigNumber(Math.pow(10, 8)));
  }

  return amountBN.toNumber();
}

export function convertAmountToStr(amount: number | undefined, asset: AssetType) {
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
