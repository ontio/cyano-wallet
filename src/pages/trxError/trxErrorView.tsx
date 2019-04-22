import * as React from "react";
import { Button, Message } from "semantic-ui-react";
import { Filler, LogoHeader, View } from "../../components";

export interface Props {
  message: object;
  handleOk: () => void;
}

export const TrxErrorView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} showAccounts={true} title="Transaction Error" />
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Message>{props.message.toString()}</Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleOk}>Ok</Button>
      </View>
    </View>
  </View>
);
