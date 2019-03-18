import * as React from "react";
import { bindActionCreators, Dispatch } from "redux";
// import { getAddress } from "../api/authApi";
// import { getTransferList, Transfer } from "../api/explorerApi";
import { getBalance, getUnboundOxg } from "../api/walletApi";
import { lifecycle, reduxConnect, withState } from "../compose";
import { GlobalState } from "../redux";
import { setBalance, setTransfers } from "../redux/wallet/walletActions";
import { Nothing } from "./nothing";

interface State {
  timer: number;
}

const mapStateToProps = (state: GlobalState) => ({
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.auth.wallet,
  netState: state.status.networkState 
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setBalance, setTransfers }, dispatch);

export const BalanceProvider: React.SFC<{}> = () =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (_, actions, getReduxProps) =>
    withState<State>({ timer: -1 }, (state, setState, getState) =>
      lifecycle(
        {
          componentDidMount: () => {
            const timer = window.setInterval(async () => {
              const reduxProps = getReduxProps();

              const walletEncoded = reduxProps.wallet;
              if (walletEncoded !== null && reduxProps.netState !== 'DISCONNECTED') {
                const balance = await getBalance(walletEncoded);
                const unboundOng = await getUnboundOxg(reduxProps.nodeAddress, reduxProps.ssl, walletEncoded);

                actions.setBalance(balance.oxg / 1000000000, balance.onyx, unboundOng / 1000000000);

                /* const address = getAddress(walletEncoded);

                  let transfers: Transfer[] = [];
                  if (reduxProps.nodeAddress !== null) {
                    transfers = await getTransferList(
                      address,
                      reduxProps.nodeAddress
                    );
                  }

                  actions.setTransfers(transfers); */
              }
            }, 5000);

            setState({ ...state, timer });
          },

          componentWillUnmount: () => {
            window.clearInterval(getState().timer);
          }
        },
        () => <Nothing />
      )
    )
  );
