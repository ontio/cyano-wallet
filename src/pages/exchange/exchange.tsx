import { get } from "lodash";
import * as React from "react";
import { FormRenderProps } from "react-final-form";
import { RouterProps } from "react-router";
import { dummy, reduxConnect, withProps, withState, withRouter, lifecycle } from "../../compose";
import { GlobalState } from "../../redux";
import { Props, ExchangeView } from "./exchangeView";
import {
  convertAmountFromStr,
  decodeAmount,
  convertOnyxToOxg
} from "../../utils/number";
import { getOxgExchangeRate } from "../../api/exchangeApi";
import { getContractAddress } from "../../api/contractsApi";

interface State {
  exhangeRate: string | null;
  contract: string | null;
}

const mapStateToProps = (state: GlobalState) => ({
  ontAmount: state.runtime.ontAmount,
  walletEncoded: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withRouter(routerProps =>
    withState<State>({ exhangeRate: null, contract: null }, (state, setState) =>
      lifecycle(
        {
          componentDidMount: async () => {
            try {
              const contract = await getContractAddress("OxgExchange");
              if (contract) {
                const rate = await getOxgExchangeRate(contract);
                setState({ exhangeRate: rate, contract });
              }
            } catch (error) {
              props.history.push("/trx-error", { e: error });
            }
          }
        },
        () => {
          return reduxConnect(mapStateToProps, dummy, (reduxProps, actions) => {
            const exhangeRate = state.exhangeRate ? decodeAmount(state.exhangeRate, 8) : null;
            let maxOxgAmount = "0";
            if (state.exhangeRate) {
              maxOxgAmount = convertOnyxToOxg(reduxProps.ontAmount, state.exhangeRate);
            }
            return withProps(
              {
                handleCancel: () => {
                  props.history.goBack();
                },
                handleConfirm: async (values: object) => {
                  const amountStr = get(values, "amount", "0");
                  const amount = convertAmountFromStr(amountStr, "OXG");
                  props.history.push("/exchange-confirm", { amount });
                },
                handleMax: (formProps: FormRenderProps) => {
                  formProps.form.change("amount", maxOxgAmount);
                  return true;
                }
              },
              injectedProps => (
                <Component
                  {...injectedProps}
                  ontAmount={reduxProps.ontAmount}
                  exhangeRate={exhangeRate}
                  maxOxgAmount={maxOxgAmount}
                />
              )
            );
          });
        }
      )
    )
  );

export const Exchange = enhancer(ExchangeView);
