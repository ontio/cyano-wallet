import * as React from "react";
import { get } from "lodash";
import { RouteComponentProps } from "react-router";
import { withProps } from "../../compose";
import { Props, trxTimedOutView } from "./trxTimedOutView";
import { convertAmountToStr } from "../../utils/number";

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const amount = get(props.location, "state.amount", "");
  const asset = get(props.location, "state.asset", "");
  const decimals = get(props.location, "state.decimals", "");

  return withProps(
    {
      handleCancel: () => {
        props.history.goBack();
      },
      handleOk: () => {
        props.history.push("/dashboard");
      },
      amount: convertAmountToStr(amount, asset, decimals),
      asset,
      trxType: get(props.location, "state.type", "")
    },
    injectedProps => <Component {...injectedProps} />
  );
};

export const TrxTimedOut = enhancer(trxTimedOutView);
