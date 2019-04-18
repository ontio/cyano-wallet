import { get } from "lodash";
import * as React from "react";
import { RouterProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { reduxConnect, withProps, lifecycle, withRouter, withState } from "../../compose";
import { GlobalState } from "../../redux";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { ClaimOnyxView, Props } from "./claimView";
import { getContractAddress } from "../../api/contractsApi";
import { createSecret } from "../../utils";
import { getUnclaimedBalance } from "../../api/claimApi";

interface State {
  balance: string | null;
}

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet,
  net: state.settings.net
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    withState<State>({ balance: "0" }, (state, setState) =>
      lifecycle(
        {
          componentDidMount: async () => {
            const username: string = get(routerProps.location, "state.userName", "");
            const password: string = get(routerProps.location, "state.password", "");
            // const userData: object = get(routerProps.location, "state.userData", "");

            const contract = await getContractAddress("Investments");
            const secretHash = createSecret(username, password, true);
            const balance = await getUnclaimedBalance(contract, secretHash);
            if (balance) {
              setState({ balance });
            }
            console.log("$$$", balance);

            // get Investments address +
            // calc secret +
            // check if investor is blocked (block-chain)
            // call getUnclaimed +
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
                  balance={state.balance}
                />
              )
            );
          });
        }
      )
    )
  );

export const ClaimOnyx = enhancer(ClaimOnyxView);
