import { FormApi } from "final-form";
import { get } from "lodash";
import { timeout, TimeoutError } from "promise-timeout";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { Props, ExchangeConfirmView } from "./exchangeConfirmView";
import { checkAccountPassword } from "../../api/accountApi";
import { exchangeOnyx } from "../../api/exchangeApi";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouteComponentProps<any>) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleCancel: () => {
          props.history.goBack();
        },

        handleSubmit: async (values: object, formApi: FormApi) => {
          const password: string = get(values, "password", "");
          const amount: number = get(props.location, "state.amount", 0);

          if (checkAccountPassword(reduxProps.wallet, password)) {
            // do nothing
          } else {
            formApi.change("password", "");
            return { password: "" };
          }

          actions.startLoading();

          try {
            await timeout(exchangeOnyx(amount, reduxProps.wallet, password), 15000);
            props.history.push("/trx-complete", {
              type: "exhange-onyx",
              amount,
              asset: "OXG"
            });
          } catch (e) {
            if (e instanceof TimeoutError) {
              props.history.push("/trx-timed-out", {
                type: "exhange-onyx",
                amount,
                asset: "OXG"
              });
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

export const ExchangeConfirm = enhancer(ExchangeConfirmView);
