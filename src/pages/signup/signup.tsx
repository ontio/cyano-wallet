import * as React from "react";
import { RouterProps } from "react-router";
import { reduxConnect, withProps, withRouter } from "../../compose";
import { Props, SignupView } from "./signupView";
import { get } from "lodash";
import { bindActionCreators, Dispatch } from "redux";
import { setWallet } from "src/redux/wallet";
import { GlobalState } from "src/redux";

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ setWallet }, dispatch);

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  wallet: state.wallet.wallet,
  settings: state.settings
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
      withProps(
        {
          handleCreate: () => {
            props.history.push("/create");
          },
          handleKeyImport: () => {
            props.history.push("/import");
          },
          handleWalletImport: (event: any) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = async (e: any) => {
              if (e.target.result !== null) {
                let data: string = get(e.target, "result");
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.identities == null) {
                    parsed.identities = [];
                    data = JSON.stringify(parsed);
                  }

                  const wallet = JSON.parse(data);
                  await actions.setWallet(JSON.stringify(wallet));
                  routerProps.history.push("/");
                } catch (e) {
                  console.log("reader.onloadend error - ", e);
                }
              }
            };
            reader.readAsText(file);
          },
          handleLedger: () => {
            props.history.push("/ledger/signup");
          },
          handleRestore: () => {
            props.history.push("/restore");
          }
        },
        injectedProps => <Component {...injectedProps} />
      )
    )
  );

export const Signup = enhancer(SignupView);
