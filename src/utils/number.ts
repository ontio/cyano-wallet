import BigNumber from "bignumber.js";
import { AssetType } from "../redux/runtime";

export function convertAmountToBN(amount: number | string | undefined, asset: AssetType, decimals?) {
  if (amount === undefined) {
    return new BigNumber(0);
  }

  let amountBN = new BigNumber(amount);

  if (asset === "OXG") {
    amountBN = amountBN.div(new BigNumber(Math.pow(10, 9)));
  } else if (asset === "ONYX") {
    amountBN = amountBN.div(new BigNumber(Math.pow(10, 8)));
  } else {
    amountBN = amountBN.div(new BigNumber(Math.pow(10, decimals)));
  }
  return amountBN.toFixed();
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

export function convertAmountToStr(amount: number | string | undefined, asset: AssetType, decimals?) {
  return convertAmountToBN(amount, asset, decimals).toString();
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

export function convertOnyxToOxg(onyx: number, rate: string | null) {
  if (!rate) {
    throw new Error("no rate");
  }

  let amountOxg = new BigNumber(onyx);
  amountOxg = amountOxg.div(new BigNumber(Math.pow(10, 8)));
  let exhangeRate = new BigNumber(rate);

  exhangeRate = exhangeRate.shiftedBy(-8);

  return amountOxg.div(exhangeRate).toString();
}

export function convertOxgToOnyx(amount: number, rate: string | null) {
  if (!rate) {
    throw new Error("no rate");
  }
  const amountOnyx = new BigNumber(amount);
  const exhangeRate = new BigNumber(rate);

  return amountOnyx.times(exhangeRate).toFixed();
}
