import { get } from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { withProps } from "../../compose";
import { Props, TrxCompleteView } from "./trxCompleteView";
import { convertAmountToStr } from "../../utils/number";

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const amount = get(props.location, "state.amount", "");
  const asset = get(props.location, "state.asset", "");
  const decimals = get(props.location, "state.decimals", "");

  return withProps(
    {
      amount: convertAmountToStr(amount, asset, decimals),
      asset,
      handleCancel: () => {
        props.history.goBack();
      },
      handleOk: () => {
        props.history.push("/dashboard");
      },
      recipient: get(props.location, "state.recipient", ""),
      trxType: get(props.location, "state.type", "")
    },
    injectedProps => <Component {...injectedProps} />
  );
};

export const TrxComplete = enhancer(TrxCompleteView);
