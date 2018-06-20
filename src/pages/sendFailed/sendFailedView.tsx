import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import { Filler, LogoHeader, View } from '../../components';

export interface Props {
  handleOk: () => void;
  amount: string;
  asset: string;
  recipient: string;
}

export const SendFailedView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} title="Transaction failed" />
      <View content={true} className="spread-around">
        <View>The transaction timeouted.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Message>Your transaction of {props.amount} {props.asset} to {props.recipient} has not completed in time. This does not mean it necessary failed. Check your balances.</Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleOk}>Ok</Button>
      </View>
    </View>
  </View>
);
