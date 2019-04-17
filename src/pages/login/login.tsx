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

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setWallet: Actions.wallet.setWallet, startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleGoBack: () => {
          props.history.goBack();
        },
        handleSubmit: async (values: object, formApi: FormApi) => {
          const password = get(values, "password", "");
          const userName = get(values, "username", "");
          console.log("submited", password, userName);
          try {
            const response = await loginAsInvestor({ password, userName });
            console.log("###", response);
            return {};
          } catch (e) {
            console.log("###", e);
            return { [FORM_ERROR]: e };
          }

          // actions.startLoading();

          // const { encryptedWif, mnemonics, wif, wallet } = await signUp(
          //   reduxProps.nodeAddress,
          //   reduxProps.ssl,
          //   password,
          //   reduxProps.wallet
          // );
          // actions.setWallet(wallet);

          // actions.finishLoading();

          // props.history.push("/new", { encryptedWif, mnemonics, wif });
        }
      },
      injectedProps => <Component {...injectedProps} loading={reduxProps.loading} />
    )
  );

export const Login = enhancer(LoginView);
