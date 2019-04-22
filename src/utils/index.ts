import { utils } from "ontology-ts-sdk";

export function isHexadecimal(str: string) {
  const regexp = /^[0-9a-fA-F]+$/;

  if (regexp.test(str)) {
    return str.length % 2 === 0;
  } else {
    return false;
  }
}

export function createSecret(userName: string, passwordHash: string, secretHash?: boolean) {
  const hexStr = utils.str2hexstr(String.prototype.concat(userName, passwordHash));
  if (secretHash) {
    return utils.sha256(utils.sha256(hexStr));
  }
  return utils.sha256(hexStr);
}
