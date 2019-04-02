import { FormApi } from "final-form";
import { get } from "lodash";
import { timeout, TimeoutError } from "promise-timeout";
import * as React from "react";
import { RouterProps } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import { withdrawOng } from "../../api/runtimeApi";
import { reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import Actions from "../../redux/actions";
import { finishLoading, startLoading } from "../../redux/loader/loaderActions";
import { Props, WithdrawConfirmView } from "./withdrawConfirmView";
import { convertAmountToStr } from "../../utils/number";

const mapStateToProps = (state: GlobalState) => ({
  loading: state.loader.loading,
  nodeAddress: state.settings.nodeAddress,
  ssl: state.settings.ssl,
  unboundAmount: state.runtime.unboundAmount,
  wallet: state.wallet.wallet
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ clearWallet: Actions.wallet.clearWallet, startLoading, finishLoading }, dispatch);

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) =>
    withProps(
      {
        handleCancel: () => {
          props.history.goBack();
        },
        handleSubmit: async (values: object, formApi: FormApi) => {
          const password: string = get(values, "password", "");

          actions.startLoading();

          try {
            await timeout(
              withdrawOng(
                reduxProps.nodeAddress,
                reduxProps.ssl,
                reduxProps.wallet,
                password,
                String(reduxProps.unboundAmount)
              ),
              15000
            );

            props.history.push("/withdrawComplete", { amount: reduxProps.unboundAmount });
          } catch (e) {
            if (e instanceof TimeoutError) {
              props.history.push("/withdrawFailed", { amount: reduxProps.unboundAmount });
            } else {
              formApi.change("password", "");

              return {
                password: ""
              };
            }
          } finally {
            actions.finishLoading();
          }

          return {};
        }
      },
      injectedProps => (
        <Component
          {...injectedProps}
          loading={reduxProps.loading}
          unboundOng={convertAmountToStr(reduxProps.unboundAmount, "OXG")}
        />
      )
    )
  );

export const WithdrawConfirm = enhancer(WithdrawConfirmView);
