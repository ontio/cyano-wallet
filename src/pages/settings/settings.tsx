import * as FileSaver from "file-saver";
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

interface State {
  settings: Settings | null;
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setSettings, setWallet }, dispatch);

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  wallet: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
withRouter((routerProps) =>
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
              handleCancel: () => {
                props.history.goBack();
              },
              handleClear: () => {
                props.history.goBack();
              },
              handleExport: () => {
                const blob = new Blob([JSON.stringify(reduxProps.wallet)!], {
                  type: "text/plain;charset=utf-8"
                });
                FileSaver.saveAs(blob, "wallet.dat");
              },
              handleImport: (event: any) => {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onloadend = async (evento: any) => {

                  if (evento.target.result !== null) {
                    let data: string = get(evento.target, 'result');

                    try {
                      const parsed = JSON.parse(data);

                      if (parsed.identities == null) {
                        parsed.identities = [];
                        data = JSON.stringify(parsed);
                      }

                      const wallet = JSON.parse(data);

                      await actions.setWallet(JSON.stringify(wallet));
                      routerProps.history.push('/'); 
                    } catch (e) {
                      console.log('catch +> ', e);
                    }
                  }
                };
                reader.readAsText(file);
              },
              handleSave: async (values: object) => {
                const net: NetValue = get(values, "net", "TEST");
                const ssl: boolean = get(values, "ssl", false);
                let address: string = get(values, "nodeAddress", "");
                if (net === "MAIN") {
                  address = "35.180.188.239";
                } else if (net === "TEST") {
                  address = "35.178.63.10";
                }
                console.log("values", { address, net, ssl });
                actions.setSettings(address, ssl, net);

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
