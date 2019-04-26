import { get } from "lodash";
import * as React from "react";
import { RouterProps } from "react-router";
import { Nothing } from "../../components";
import { reduxConnect, withProps, withRouter } from "../../compose";
import { bindActionCreators, Dispatch } from "redux";
import { GlobalState } from "../../redux";
import { setSettings } from "../../redux/settings/settingsActions";

import { Props, SettingsView } from "./settingsView";
import { setWallet } from "src/redux/wallet";
import { testOpts, propdOpts } from "../../api/constants";
import { NetValue } from "../../redux/settings/settingsReducer";

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setSettings, setWallet }, dispatch);

const mapStateToProps = (state: GlobalState) => ({
  wallet: state.wallet.wallet,
  settings: state.settings
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
      withProps(
        {
          handleTokenSettings: () => {
            routerProps.history.push("/settings/token");
          },
          handleCancel: () => {
            props.history.goBack();
          },
          handleSave: async (values: object) => {
            const net: NetValue = get(values, "net", "TEST");
            const ssl: boolean = get(values, "ssl", false);
            let address: string = get(values, "nodeAddress", "");
            if (net === "MAIN") {
              address = propdOpts.node.address;
            } else if (net === "TEST") {
              address = testOpts.node.address;
            }
            actions.setSettings(address, ssl, net, reduxProps.settings.tokens);

            props.history.goBack();
          }
        },
        injectedProps => {
          if (reduxProps.settings !== null) {
            return <Component {...injectedProps} settings={reduxProps.settings} />;
          } else {
            return <Nothing />;
          }
        }
      )
    )
  );

export const SettingsPage = enhancer(SettingsView);
