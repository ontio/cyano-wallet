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
import { isCurrentUserMnemonics } from "../../api/authApi";
import { FormApi, FORM_ERROR } from "final-form";

interface State {
  balance: string | null;
  contract: string | null;
  secret: string;
  firstName: string;
  sureName: string;
  balanceError: string | null;
}

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet,
  net: state.settings.net
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    withState<State>(
      { balance: "0", contract: "", secret: "", firstName: "", sureName: "", balanceError: null },
      (state, setState) =>
        lifecycle(
          {
            componentDidMount: async () => {
              // const username: string = get(routerProps.location, "state.userName", "");
              // const passwordHash: string = get(routerProps.location, "state.password", "");
              const userData: any = get(routerProps.location, "state.userData", "");
              const firstName = userData.field_afl_first_name.und[0].value;
              const sureName = userData.field_afl_surname.und[0].value;

              let balance: string | null = null;
              const contract = await getContractAddress("Investments");
              // const secretHash = createSecret(username, passwordHash, true);
              // const secret = createSecret(username, passwordHash);
              const secretHash = createSecret(
                "A833682",
                "$S$D5qEwDIeGjNFVzIv6ngAADZNpFId4LbJTAGrU0YNZIxAMZXpLz6T",
                true
              );
              const secret = createSecret("A833682", "$S$D5qEwDIeGjNFVzIv6ngAADZNpFId4LbJTAGrU0YNZIxAMZXpLz6T");
              if (contract) {
                balance = await getUnclaimedBalance(contract, secretHash);
              } else {
                // show error message
              }

              if (balance === "0") {
                setState({ balance, contract, secret, firstName, sureName, balanceError: "Nothing to claim!" });
              } else if (Number(balance)) {
                setState({ balance, contract, secret, firstName, sureName, balanceError: null });
              } else {
                // show error message
              }
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
                  handleСonfirm: async (values: object, formApi: FormApi) => {
                    const mnemonics = get(values, "mnemonics", "");
                    if (isCurrentUserMnemonics(mnemonics, reduxProps.wallet)) {
                      // actions.startLoading();
                      const { contract, secret } = state;

                      routerProps.history.push("/claim-onyx-confirm", { contract, secret, balance: state.balance });
                      return {};
                    } else {
                      formApi.change("mnemonics", "");
                      return { [FORM_ERROR]: "Mnemonics don't match current account!" };
                    }
                  }
                },
                injectedProps => (
                  <Component
                    {...injectedProps}
                    loading={reduxProps.loading}
                    currentAddress={currentAddress}
                    balance={state.balance}
                    firstName={state.firstName}
                    sureName={state.sureName}
                    balanceError={state.balanceError}
                  />
                )
              );
            });
          }
        )
    )
  );

export const ClaimOnyx = enhancer(ClaimOnyxView);
