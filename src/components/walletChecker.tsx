import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { getAddress } from '../api/authApi';
import { getTransferList } from '../api/explorerApi';
import { getBalance } from '../api/walletApi';
import { lifecycle, reduxConnect, withState } from '../compose';
import { GlobalState } from '../redux';
import { setBalance, setTransfers } from '../redux/wallet/walletActions';

interface State {
  timer: number;
}

const mapStateToProps = (state: GlobalState) => ({
  wallet: state.auth.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setBalance, setTransfers }, dispatch);

const enhancer = (Component: React.ComponentType<{}>) => () => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions, getReduxProps) => (
    withState<State>({ timer: -1 }, (state, setState, getState) => (
      lifecycle({
        componentDidMount: () => {
          const timer = window.setInterval(async () => {
            
            const walletEncoded = getReduxProps().wallet;
            if (walletEncoded !== null) {
              const balance = await getBalance(walletEncoded);
              actions.setBalance(balance.ong / 1000000000, balance.ont);

              const address = getAddress(walletEncoded);
              const transfers = await getTransferList(address);
              actions.setTransfers(transfers);
            }
          }, 5000);

          setState({ ...state, timer });
        },

        componentWillUnmount: () => {
          window.clearInterval(getState().timer);
        }
      }, () => (
        <Component />
      ))
    ))
  ))
);

export const WalletChecker = enhancer(() => null);
