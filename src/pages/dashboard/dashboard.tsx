import * as React from "react";
import { RouterProps } from "react-router";
import { getAddress } from "../../api/authApi";
import { dummy, reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { DashboardView, Props } from "./dashboardView";
import { convertAmountToStr } from "../../utils/number";

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  transfers: state.runtime.transfers,
  unboundAmount: state.runtime.unboundAmount,
  wallet: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, reduxProps =>
    withProps(
      {
        handleReceive: () => {
          props.history.push("/receive");
        },
        handleSend: () => {
          props.history.push("/send");
        },
        handleTransfers: () => {
          props.history.push("/transfers");
        },
        handleWithdraw: () => {
          if (reduxProps.unboundAmount > 0) {
            props.history.push("/withdrawConfirm");
          }
        },
        ownAddress: getAddress(reduxProps.wallet),
        transfers: reduxProps.transfers !== null ? reduxProps.transfers.slice(0, 2) : null
      },
      injectedProps => (
        <Component
          {...injectedProps}
          ontAmount={convertAmountToStr(reduxProps.ontAmount, "ONYX")}
          ongAmount={convertAmountToStr(reduxProps.ongAmount, "OXG")}
          unboundAmount={convertAmountToStr(reduxProps.unboundAmount, "OXG")}
        />
      )
    )
  );

export const Dashboard = enhancer(DashboardView);
