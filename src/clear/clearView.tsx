import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader/logoHeader';
import { Filler, View } from '../View';

export interface Props {
  handleCancel: () => void;

  handleClear: () => Promise<void>;
  loading: boolean;
}

export const ClearView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} title="Clear identity" />
      <View content={true} className="spread-around">
        <View>Clearing will erase your identity and wallet from this device.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <Message>Make sure you have your private key or mnemonics phrase backed up if you don't want to lose currently stored identity.</Message>
      <Filler />
      <View className="buttons">
        <Button disabled={props.loading} loading={props.loading} onClick={props.handleClear}>Clear</Button>
        <Button disabled={props.loading} onClick={props.handleCancel}>Cancel</Button>
      </View>
    </View>
  </View>
);
