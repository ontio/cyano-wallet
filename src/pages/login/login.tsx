import { get } from "lodash";
import * as React from "react";
import { RouterProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { loginAsInvestor } from "../../api/claimApi";
import { reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import Actions from "../../redux/actions";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { LoginView, Props } from "./loginView";
import { FormApi, FORM_ERROR } from "final-form";
import { timeout, TimeoutError } from "promise-timeout";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { setWallet: Actions.wallet.setWallet, startLoading, finishLoading },
    dispatch
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleGoBack: () => {
          props.history.goBack();
        },
        handleSubmit: async (values: object, formApi: FormApi) => {
          const password = get(values, "password", "");
          const username = get(values, "username", "");
          try {
            actions.startLoading();
            const response = await timeout(loginAsInvestor({ password, username }), 15000);
            if (response.status === 200) {
              props.history.push("/claim-onyx", { password, username, userData: response.data });
            } else if (response.status === 404) {
              return { [FORM_ERROR]: response.data };
            } else if (response.status) {
              return { [FORM_ERROR]: response.data };
            } else {
              return { [FORM_ERROR]: response.data };
            }
          } catch (e) {
            if (e instanceof TimeoutError) {
              return { [FORM_ERROR]: "Authentication server does not respond" };
            }
          } finally {
            actions.finishLoading();
          }
          return {};
        }
      },
      injectedProps => <Component {...injectedProps} loading={reduxProps.loading} />
    )
  );

export const Login = enhancer(LoginView);
