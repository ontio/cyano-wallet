export const SET_WALLET = 'SET_WALLET';
export const CLEAR_WALLET = 'CLEAR_WALLET';

export const setWallet = (walletEncoded: string) => ({ type: SET_WALLET, wallet: JSON.parse(walletEncoded) });
export const clearWallet = () => ({ type: CLEAR_WALLET });
