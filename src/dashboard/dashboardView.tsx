import * as React from 'react';
import { Button } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader';
import { Filler, View } from '../View';

export interface Props {
  ontAmount: number;
  ongAmount: number;
  handleSend: () => void,
  handleReceive: () => void
}

export const DashboardView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="Balances" />
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
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleSend}>Send</Button>
        <Button onClick={props.handleReceive}>Receive</Button>
      </View>
    </View>
  </View>
);
