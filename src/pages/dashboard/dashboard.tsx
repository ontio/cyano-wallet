import * as React from "react";
import { RouterProps } from "react-router";
import { getAddress } from "../../api/authApi";
import { dummy, reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { DashboardView, Props } from "./dashboardView";
import { convertAmountToStr } from "../../utils/number";
import { TokenState } from "../../redux/settings/settingsReducer";
import { TokenAmountState } from "../../redux/runtime";
import { OEP4TokenAmount } from "../../api/tokenApi";
import { decodeAmount } from "../../utils/number";

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  tokenAmounts: state.runtime.tokenAmounts,
  tokens: state.settings.tokens,
  transfers: state.runtime.transfers,
  unboundAmount: state.runtime.unboundAmount,
  wallet: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, reduxProps => {
    return withProps(
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
        handleOpenTransfers: () => {
          props.history.push("/withdrawConfirm");
        },
        handleInvestorLogin: () => {
          props.history.push("/investor-login");
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
          tokens={
            reduxProps.tokens.length && reduxProps.tokenAmounts.length
              ? prepareTokenAmounts(reduxProps.tokens, reduxProps.tokenAmounts)
              : []
          }
        />
      )
    );
  });

function prepareTokenAmounts(tokens: TokenState[] = [], items: TokenAmountState[] = []): OEP4TokenAmount[] {
  return items.map(item => {
    const contract = item.contract;
    const token = tokens.find(t => t.contract === contract)!;

    const amount = decodeAmount(item.amount, token.decimals);

    return {
      amount,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol
    };
  });
}

export const Dashboard = enhancer(DashboardView);
