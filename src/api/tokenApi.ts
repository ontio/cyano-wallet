export type VmType = 'NEOVM' | 'WASMVM';

export interface OEP4Token {
  name: string;
  symbol: string;
  decimals: number;
  vmType: VmType;
}

export interface OEP4TokenAmount extends OEP4Token {
  amount: string;
}
