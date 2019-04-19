import { get } from "lodash";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { withProps } from "../../compose";
import { Props, TrxErrorView } from "./trxErrorView";

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  withProps(
    {
      message: get(props.location, "state.e", ""),
      handleOk: () => {
        props.history.push("/dashboard");
      }
    },
    injectedProps => <Component {...injectedProps} />
  );

export const TrxError = enhancer(TrxErrorView);
