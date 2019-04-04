import { TokenAmountState } from "./redux/runtime";
import Actions from "./redux/actions";
import { GlobalStore } from "./redux";
import { getBalance, getUnboundOxg } from "./api/runtimeApi";
// import { getTransferList } from "./api/explorerApi";
// import { getAddress } from "./api/authApi";
import { getTokenBalanceOwn } from "./api/tokenApi";

export async function refreshBalance(store: GlobalStore) {
  const state = store.getState();
  const walletEncoded = state.wallet.wallet;
  const tokens = state.settings.tokens;

  if (walletEncoded !== null) {
    try {
      const settings = state.settings;
      const balance = await getBalance(walletEncoded);
      const unboundOng = await getUnboundOxg(settings.nodeAddress, settings.ssl, walletEncoded);

      const tokenBalances: TokenAmountState[] = [];

      for (const token of tokens) {
        try {
          const amount = await getTokenBalanceOwn(token.contract, walletEncoded);
          tokenBalances.push({ contract: token.contract, amount, symbol: token.symbol });
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.warn("Failed to load balance of token: ", token.contract);
        }
      }
      console.log("balance of tokens:", tokenBalances);

      store.dispatch(Actions.runtime.setBalance(balance.oxg, balance.onyx, unboundOng, tokenBalances));

      /* const address = getAddress(walletEncoded);
      const transfers = await getTransferList(address, settings.nodeAddress);
      store.dispatch(Actions.runtime.setTransfers(transfers)); */
    } catch (e) {
      // ignore
    }
  }
}

export function initBalanceProvider(store: GlobalStore) {
  refreshBalance(store);
  window.setInterval(async () => {
    refreshBalance(store);
  }, 15000);
}
