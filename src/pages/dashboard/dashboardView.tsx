import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { Transfer } from '../../api/explorerApi';
import { Clickable, Filler, LogoHeader, Spacer, View } from '../../components';
import { TransferList } from '../../components/transferList';

export interface Props {
  ontAmount: number;
  ongAmount: number;
  ownAddress: string;
  transfers: Transfer[] | null;
  handleSend: () => void;
  handleTransfers: () => void;
  handleReceive: () => void;
}

export const DashboardView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={true} title="Balances" />
      <View content={true} className="spread-around">
        <View orientation="column">
          <label>ONT</label>
          <h1>{props.ontAmount}</h1>
        </View>
        <View orientation="column">
          <label>ONG</label>
          <h1>{props.ongAmount}</h1>
        </View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <h1>Last transfers</h1>
      <Spacer />
      <TransferList ownAddress={props.ownAddress} transfers={props.transfers} />
      <Spacer />
      <View className="center">
        <Clickable onClick={props.handleTransfers}>more</Clickable>
      </View>
      <Filler />
      <View className="buttons">
        <Button icon="send" content="Send" onClick={props.handleSend} />
        <Button icon="inbox" content="Receive" onClick={props.handleReceive} />
      </View>
    </View>
  </View>
);
