
export interface OEP4Token {
  name: string;
  symbol: string;
  decimals: number;
}

export interface OEP4TokenAmount extends OEP4Token {
  amount: string;
}