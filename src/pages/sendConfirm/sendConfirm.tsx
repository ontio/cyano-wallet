import { FormApi } from "final-form";
import { get } from "lodash";
import { timeout, TimeoutError } from "promise-timeout";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { transfer } from "../../api/runtimeApi";
import { reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { Props, SendConfirmView } from "./sendConfirmView";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  wallet: state.wallet.wallet
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
          const recipient: string = get(props.location, "state.recipient", "");
          const asset: "ONYX" | "OXG" = get(props.location, "state.asset", "");
          const amount: string = get(props.location, "state.amount", "");

          const password: string = get(values, "password", "");

          actions.startLoading();

          try {
            await timeout(
              transfer(reduxProps.nodeAddress, reduxProps.ssl, reduxProps.wallet, password, recipient, asset, amount),
              15000
            );
            props.history.push("/sendComplete", { recipient, asset, amount });
          } catch (e) {
            
            if (e instanceof TimeoutError) {
              console.log('(catch) TimeoutError');
              props.history.push("/sendFailed", { recipient, asset, amount });
            } else if (e === 53000) {
               // 53000 - Decrypto_ERROR (Decryption error)
              formApi.change("password", "");
              return { password: "" };
            } else {
              props.history.push("/sendError", { e });
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

export const SendConfirm = enhancer(SendConfirmView);
