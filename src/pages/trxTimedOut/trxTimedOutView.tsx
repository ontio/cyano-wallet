import * as React from "react";
import { Button, Message } from "semantic-ui-react";
import { Filler, LogoHeader, View } from "../../components";

export interface Props {
  handleOk: () => void;
}

// TODO: add description of trx
export const trxTimedOutView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Transaction failed" />
      <View content={true} className="spread-around">
        <View>The transaction is timed out.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Message>
        Your transaction has not completed in time. This does not mean it necessary failed. Check your balances.
      </Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleOk}>Ok</Button>
      </View>
    </View>
  </View>
);
