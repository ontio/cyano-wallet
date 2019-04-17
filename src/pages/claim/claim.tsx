import { get } from "lodash";
import * as React from "react";
import { RouterProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { reduxConnect, withProps, lifecycle, withRouter, withState } from "../../compose";
import { GlobalState } from "../../redux";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { ClaimOnyxView, Props } from "./claimView";
import { getContractAddress } from "../../api/contractsApi";

interface State {
  hello: string | null;
}

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet,
  net: state.settings.net
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    withState<State>({ hello: "World" }, (state, setState) =>
      lifecycle(
        {
          componentDidMount: async () => {
            const username: string = get(routerProps.location, "state.userName", "");
            const password: string = get(routerProps.location, "state.password", "");
            const auth: string = get(routerProps.location, "state.auth", "");
            console.log("Mounted!", username, password, auth);
            const InvestmentsAddres = await getContractAddress("OnyxPay");
            console.log("InvestmentsAddres", InvestmentsAddres);

            // get Investments address
            // calc secret
            // check if investor is blocked (block-chain)
            // call getUnclaimed
            // show balance to claim
            // show text field for mnemonic
            // make claim trx
            // call rest api to decrement claimed amount
          }
        },
        () => {
          return reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
            const currentAddress = get(reduxProps.wallet, "defaultAccountAddress", "");

            return withProps(
              {
                handleCancel: () => {
                  props.history.push("/");
                },
                handleСonfirm: async () => {
                  console.log("Confirmed");
                }
              },
              injectedProps => (
                <Component
                  {...injectedProps}
                  loading={reduxProps.loading}
                  currentAddress={currentAddress}
                  hello={state.hello}
                />
              )
            );
          });
        }
      )
    )
  );

export const ClaimOnyx = enhancer(ClaimOnyxView);
