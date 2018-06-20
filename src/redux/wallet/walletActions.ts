import { Transfer } from "../../api/explorerApi";

export const SET_BALANCE = 'SET_BALANCE';
export const SET_TRANSFERS = 'SET_TRANSFERS';

export const setBalance = (ongAmount: number, ontAmount: number) => ({ type: SET_BALANCE, ongAmount, ontAmount });

export const setTransfers = (transfers: Transfer[]) => ({ type: SET_TRANSFERS, transfers });
