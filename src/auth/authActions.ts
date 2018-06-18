export const SET_WALLET = 'SET_WALLET';

export const setWallet = (walletEncoded: string) => ({ type: SET_WALLET, wallet: JSON.parse(walletEncoded) });
