/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
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
  withState
} from "../../compose";
import { bindActionCreators, Dispatch } from "redux";
import { GlobalState } from "../../redux";
import { setSettings } from "../../redux/settings/settingsActions";

import { Props, SettingsView } from "./settingsView";

interface State {
  settings: Settings | null;
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setSettings }, dispatch);

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  wallet: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
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
  );

export const SettingsPage = enhancer(SettingsView);
