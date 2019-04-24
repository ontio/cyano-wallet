import { get } from "lodash";
import * as React from "react";
import { RouterProps } from "react-router";
import {
  loadSettings,
  NetValue,
  // saveSettings,
  Settings
} from "../../api/settingsApi";
import { Nothing } from "../../components";
import {
  // dummy,
  lifecycle,
  reduxConnect,
  withProps,
  withState,
  withRouter
} from "../../compose";
import { bindActionCreators, Dispatch } from "redux";
import { GlobalState } from "../../redux";
import { setSettings } from "../../redux/settings/settingsActions";

import { Props, SettingsView } from "./settingsView";
import { setWallet } from "src/redux/wallet";
import { prodOptions, testOptions } from "../../api/constants";

interface State {
  settings: Settings | null;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setSettings, setWallet }, dispatch);

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  wallet: state.wallet.wallet,
  settings: state.settings
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    withState<State>({ settings: null }, (state, setState) =>
      lifecycle(
        {
          componentDidMount: async () => {
            const settings = await loadSettings();

            setState({ ...state, settings });
          }
        },
        () =>
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
                    address = prodOptions.value;
                  } else if (net === "TEST") {
                    address = testOptions.value;
                  }
                  actions.setSettings(address, ssl, net, reduxProps.settings.tokens);

                  props.history.goBack();
                }
              },
              injectedProps => {
                if (state.settings !== null) {
                  return (
                    <Component
                      {...injectedProps}
                      settings={state.settings}
                      ontAmount={reduxProps.ontAmount}
                      ongAmount={reduxProps.ongAmount}
                    />
                  );
                } else {
                  return <Nothing />;
                }
              }
            )
          )
      )
    )
  );

export const SettingsPage = enhancer(SettingsView);
