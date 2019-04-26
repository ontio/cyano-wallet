import * as React from "react";
import { GlobalState } from "../../redux";
import { dummy, reduxConnect, withProps } from "../../compose";
import { Props, StatusBarView } from "./statusBarView";

const mapStateToProps = (state: GlobalState) => ({
  net: state.settings.net,
  status: state.status.networkState
});

const enhancer = (Component: React.ComponentType<Props>) => () =>
  reduxConnect(mapStateToProps, dummy, reduxProps => {
    const net = reduxProps.net;

    let netName = "";
    if (net === "MAIN") {
      netName = "OnyxChain MAIN-NET";
    } else if (net === "TEST") {
      netName = "OnyxChain TEST-NET";
    } else {
      netName = "PRIVATE-NET";
    }

    return withProps({}, props => <Component status={reduxProps.status} netName={netName} />);
  });

export const StatusBar = enhancer(StatusBarView);
