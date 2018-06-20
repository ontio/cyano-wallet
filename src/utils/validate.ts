import { get } from 'lodash';
import { utils } from 'ont-sdk-ts';
export function validMnemonics(value: string) {
  try {
    utils.parseMnemonic(value);
    return false;
  } catch (e) {
    return true;
  }
};

export function samePassword(values: object) {
  const password = get(values, 'password', '');
  const passwordAgain = get(values, 'passwordAgain', '');

  if (password !== passwordAgain) {
    return {
      passwordAgain: "Password does not match"
    }
  }

  return {};
}

export function required(value: string){ 
  return (value === undefined || value.trim().length === 0);
}
