import { get } from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { withProps } from "../../compose";
import { Props, SendCompleteView } from "./sendCompleteView";
import { convertAmountToStr } from "../../utils/number";

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const amount = get(props.location, "state.amount", "");
  const asset = get(props.location, "state.asset", "");

  return withProps(
    {
      amount: convertAmountToStr(amount, asset),
      asset,
      handleCancel: () => {
        props.history.goBack();
      },
      handleOk: () => {
        props.history.push("/dashboard");
      },
      recipient: get(props.location, "state.recipient", "")
    },
    injectedProps => <Component {...injectedProps} />
  );
};

export const SendComplete = enhancer(SendCompleteView);
