import * as React from "react";
import { LogoHeader, View, Spacer } from "../../components";
import { Button } from "semantic-ui-react";

export interface Props {
  handlePrivateKeyRestore: () => void;
  handleMnemonicsPhraseRestore: () => void;
  handleBack: () => void;
}

export const AccountsRestoreView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} title="Accounts" />
      <View content={true} className="spread-around">
        <View>Restore an existing account.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" className="buttons" style={{ alignItems: "center" }}>
        <Button onClick={props.handlePrivateKeyRestore}>Use private key</Button>
        <Spacer />
        <Button onClick={props.handleMnemonicsPhraseRestore}>Use mnemonics phrase</Button>
        <Spacer />
        <Button onClick={props.handleBack}>Back</Button>
      </View>
    </View>
  </View>
);
