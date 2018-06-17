import * as React from 'react';
import { Button, List } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader';
import { Filler, View } from '../View';

export interface Props {
  ontAmount: number;
  ongAmount: number;
  handleSend: () => void,
  handleReceive: () => void
}

export const NewView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="New identity" />
      <View content={true} className="spread-around">
        <View>Your new identity as created. Here you have your 24 mnemonics. You can use it to restore your identity.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <List items={['Apples', 'Pears', 'Oranges']} />
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleSend}>Send</Button>
        <Button onClick={props.handleReceive}>Receive</Button>
      </View>
    </View>

  </View>
);
