import * as React from "react";
import { Button } from "semantic-ui-react";
import { Logo, Spacer, View } from "../../components";

export interface Props {
  handleCreate: () => void;
  handleImport: () => void;
  handleRestore: () => void;
}

export const SignupView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true} className="gradient">
    <Logo />
    <View orientation="column" className="hint">
      <View>To start using wallet, please</View>
      <View>create new account or import existing.</View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" fluid={true} className="center signButtons">
        <Spacer />
        <Button size="small" onClick={props.handleCreate}>
          New account
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleImport}>
          Import private key
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleRestore}>
          Restore account
        </Button>
      </View>
    </View>
  </View>
);
