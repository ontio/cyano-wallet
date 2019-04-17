export function isHexadecimal(str: string) {
  const regexp = /^[0-9a-fA-F]+$/;

  if (regexp.test(str)) {
    return str.length % 2 === 0;
  } else {
    return false;
  }
}

export const wait = (ms: number, resolveWith: any) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(resolveWith), ms);
  });
};
