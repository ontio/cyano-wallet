import { get } from "lodash";
import * as React from "react";
import { FormRenderProps } from "react-final-form";
import { RouterProps } from "react-router";
import { dummy, reduxConnect, withProps } from "../../compose";
import { GlobalState } from "../../redux";
import { Props, SendView } from "./sendView";
import { convertAmountToBN, convertAmountFromStr } from "../../utils/number";

const mapStateToProps = (state: GlobalState) => ({
  ongAmount: state.runtime.ongAmount,
  ontAmount: state.runtime.ontAmount,
  walletEncoded: state.wallet.wallet
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, reduxProps =>
    withProps(
      {
        handleCancel: () => {
          props.history.goBack();
        },
        handleConfirm: async (values: object) => {
          const recipient = get(values, "recipient", "");
          const asset = get(values, "asset", "");
          const amountStr = get(values, "amount", "0");
          const amount = convertAmountFromStr(amountStr, asset);
          console.log("amount", amount);
          props.history.push("/sendConfirm", { recipient, asset, amount });
        },
        handleMax: (formProps: FormRenderProps) => {
          const asset: string | undefined = get(formProps.values, "asset");

          if (asset === "ONYX") {
            const amountBN = convertAmountToBN(reduxProps.ontAmount, "ONYX");
            formProps.form.change("amount", amountBN.toString());
          } else if (asset === "OXG") {
            const amountBN = convertAmountToBN(reduxProps.ongAmount, "OXG");
            formProps.form.change("amount", amountBN.toString());
          }
          return true;
        }
      },
      injectedProps => (
        <Component {...injectedProps} ontAmount={reduxProps.ontAmount} ongAmount={reduxProps.ongAmount} />
      )
    )
  );

export const Send = enhancer(SendView);
