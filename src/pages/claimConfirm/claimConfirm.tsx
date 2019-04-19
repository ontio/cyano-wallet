import { FormApi } from "final-form";
import { get } from "lodash";
import { timeout, TimeoutError } from "promise-timeout";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { Props, ClaimConfirmView } from "./claimConfirmView";
import { checkAccountPassword } from "../../api/accountApi";
import { claimOnyx } from "../../api/claimApi";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.wallet.wallet,
  tokens: state.settings.tokens
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleCancel: () => {
          props.history.goBack();
        },

        handleSubmit: async (values: object, formApi: FormApi) => {
          const password: string = get(values, "password", "");
          const contract: string = get(props.location, "state.contract", "");
          const secret: string = get(props.location, "state.secret", "");
          if (checkAccountPassword(reduxProps.wallet, password)) {
            console.log(password, contract, secret);
          } else {
            formApi.change("password", "");
            return { password: "" };
          }

          actions.startLoading();

          try {
            await timeout(claimOnyx(contract, secret, reduxProps.wallet, password), 15000);
            props.history.push("/trx-complete", { type: "claim" });
          } catch (e) {
            if (e instanceof TimeoutError) {
              props.history.push("/trx-timed-out", { type: "claim" });
            } else {
              props.history.push("/trx-error", { e });
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

export const ClaimConfirm = enhancer(ClaimConfirmView);
