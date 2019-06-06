import { utils } from "ontology-ts-sdk";

export function isHexadecimal(str: string) {
  const regexp = /^[0-9a-fA-F]+$/;

  if (regexp.test(str)) {
    return str.length % 2 === 0;
  } else {
    return false;
  }
}

export function createSecret(passwordHash: string) {
  const hexStr = utils.str2hexstr(passwordHash);
  const secret = utils.sha256(hexStr);
  return [secret, utils.sha256(secret)];
}
