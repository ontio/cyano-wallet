import * as React from "react";
import { RouterProps } from "react-router";
import { dummy, reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { Props, TokenSettingsView } from "./tokenSettingsView";

const mapStateToProps = (state: GlobalState) => ({
  tokens: state.settings.tokens
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, reduxProps =>
    withProps(
      {
        handleAdd: () => {
          props.history.push("/settings/token/add");
        },
        handleBack: () => {
          props.history.replace("/settings");
        },
        handleDel: (contract: string) => {
          props.history.push("/settings/token/del", { contract });
          console.log("ope-4 address to delete: ", contract);
        }
      },
      injectedProps => <Component {...injectedProps} tokens={reduxProps.tokens} />
    )
  );

export const TokenSettings = enhancer(TokenSettingsView);
