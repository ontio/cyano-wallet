import * as React from "react";
import { Button, Message } from "semantic-ui-react";
import { Filler, LogoHeader, View } from "../../components";

export interface Props {
  handleOk: () => void;
  amount: string;
  asset: string;
  recipient: string;
  trxType: string;
}

export const TrxCompleteView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Transaction finished" />
      <View content={true} className="spread-around">
        <View>It could take a while until the balances change.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Message>
        Your <strong>{props.trxType}</strong> transaction of has completed. This does not mean it succeeded. Check your
        balances.
      </Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleOk}>Ok</Button>
      </View>
    </View>
  </View>
);
