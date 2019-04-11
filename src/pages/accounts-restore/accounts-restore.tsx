import * as React from "react";
import { RouterProps } from "react-router";
import { withProps } from "../../compose";
import { Props, AccountsRestoreView } from "./accounts-restoreView";

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  withProps(
    {
      handlePrivateKeyRestore: () => {
        props.history.push("/import");
      },
      handleMnemonicsPhraseRestore: () => {
        props.history.push("/restore/mnemonic");
      },
      handleBack: () => {
        props.history.goBack();
      },
    },
    injectedProps => <Component {...injectedProps} />
  );

export const AccountsRestore = enhancer(AccountsRestoreView);
