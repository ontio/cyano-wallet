/* import { TokenAmountState } from 'src/redux/runtime';
import { getAddress } from '../api/accountApi';
import Actions from '../redux/actions';
import { GlobalStore } from '../redux/state';
import { getTransferList } from './api/explorerApi';
import { getBalance, getUnboundOng } from './api/runtimeApi';
import { getTokenBalanceOwn } from './api/tokenApi';

export async function refreshBalance(store: GlobalStore) {
  const state = store.getState();
  const walletEncoded = state.wallet.wallet;
  const tokens = state.settings.tokens;

  if (walletEncoded !== null) {
    try {
      const balance = await getBalance();
      const unboundOng = await getUnboundOng();

      const tokenBalances: TokenAmountState[] = [];

      for (const token of tokens) {
        try {
          const amount = await getTokenBalanceOwn(token.contract);
          tokenBalances.push({ contract: token.contract, amount });
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.warn('Failed to load balance of token: ', token.contract);
        }
      }

      store.dispatch(Actions.runtime.setBalance(balance.ong, balance.ont, unboundOng, 0, tokenBalances));

      const address = getAddress(walletEncoded);

      const transfers = await getTransferList(address);

      store.dispatch(Actions.runtime.setTransfers(transfers));
    } catch (e) {
      // ignore
    }
  }
}

export function initBalanceProvider(store: GlobalStore) {
  window.setInterval(async () => {
    refreshBalance(store);
  }, 15000);
}
 */
