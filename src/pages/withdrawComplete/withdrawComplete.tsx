import { get } from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { withProps } from "../../compose";
import { Props, WithdrawCompleteView } from "./withdrawCompleteView";
import { convertAmountToStr } from "../../utils/number";

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) => {
  const amount = get(props.location, "state.amount", "");
  return withProps(
    {
      amount: convertAmountToStr(amount, "OXG"),
      handleCancel: () => {
        props.history.goBack();
      },
      handleOk: () => {
        props.history.push("/dashboard");
      }
    },
    injectedProps => <Component {...injectedProps} />
  );
};
export const WithdrawComplete = enhancer(WithdrawCompleteView);
