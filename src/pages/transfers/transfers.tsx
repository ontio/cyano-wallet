import * as React from "react";
import { RouterProps } from "react-router";
import { getAddress } from "../../api/authApi";
import { getTransferList } from "../../api/explorerApi";
import { dummy, reduxConnect, withProps, lifecycle } from "../../compose";
import { Props, TransfersView } from "./transfersView";
import { reduxStore as store, GlobalState } from "../../redux";
import actions from "../../redux/actions";

const mapStateToProps = (state: GlobalState) => ({
  transfers: state.runtime.transfers,
  wallet: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  lifecycle(
    {
      componentDidMount: async () => {
        const state = store.getState();
        const walletEncoded = state.wallet.wallet;

        const address = getAddress(walletEncoded);
        const transfers = await getTransferList(address);
        store.dispatch(actions.runtime.setTransfers(transfers));
      }
    },
    () => reduxConnect(mapStateToProps, dummy, reduxProps =>
      withProps(
        {
          handleBack: () => {
            props.history.push("/dashboard");
          },
          ownAddress: getAddress(reduxProps.wallet)
        },
        injectedProps => <Component {...injectedProps} transfers={reduxProps.transfers} />
      )
    )
  );

export const Transfers = enhancer(TransfersView);
