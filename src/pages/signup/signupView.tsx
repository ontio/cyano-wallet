import * as React from "react";
import { Button } from "semantic-ui-react";
import { Logo, Spacer, View } from "../../components";

export interface Props {
  handleCreate: () => void;
  handleWalletImport: (event: any) => void;
  handleRestore: () => void;
}

export const SignupView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true} className="gradient">
    <View orientation="column" className="container">
      <Logo/>
      <View orientation="column" className="hint">
        <View>To start using wallet, please</View>
        <View>create new account or restore existing.</View>
      </View>
      <View orientation="column" fluid={true} content={true}>
        <View orientation="column" fluid={true} className="center signButtons">
          <Button size="small" onClick={props.handleCreate}>
            New account
          </Button>
          <Spacer/>
          <Button size="small" onClick={props.handleRestore}>
            Restore account
          </Button>
          <Spacer/>

          <label className="ui button" htmlFor="inputWallet" style={{cursor: "pointer"}}>
            Import wallet
            <input
              type="file"
              id="inputWallet"
              style={{display: "none"}}
              onChange={props.handleWalletImport}
            />
          </label>
        </View>
      </View>
    </View>
  </View>
);
