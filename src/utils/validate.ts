import { get } from "lodash";
import { utils, Crypto } from "ontology-ts-sdk";

export function validMnemonics(value: string) {
  try {
    utils.parseMnemonic(value);
    return false;
  } catch (e) {
    return true;
  }
}

export function isHexadecimal(str: string) {
  const regexp = /^[0-9a-fA-F]+$/;

  if (regexp.test(str)) {
    return str.length % 2 === 0;
  } else {
    return false;
  }
}

export function samePassword(values: object) {
  const password = get(values, "password", "");
  const passwordAgain = get(values, "passwordAgain", "");

  if (password !== passwordAgain) {
    return {
      passwordAgain: "Password does not match"
    };
  }

  return {};
}

export function required(value: string) {
  return value === undefined || value.trim().length === 0;
}

export function range(from: number, to: number) {
  return function rangeCheck(value: string) {
    if (value === undefined) {
      return true;
    }

    const val = Number(value);
    return val <= from || val > to;
  };
}

export function tokenValid(value: string) {
  return required(value) || !isHexadecimal(value) || value.length !== 40;
}

export function gt(than: number) {
  return function gtCheck(value: string) {
    if (value === undefined) {
      return true;
    }

    const val = Number(value);
    return val <= than;
  };
}

export function gte(than: number) {
  return function gtCheck(value: string) {
    if (value === undefined) {
      return true;
    }

    const val = Number(value);
    return val < than;
  };
}

export function testBase58Address(address: string) {
  try {
    new Crypto.Address(address).toHexString();
    return undefined;
  } catch (error) {
    return "Recipient's address should be in base58 format";
  }
}
