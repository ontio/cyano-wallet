import * as QRCode from 'qrcode.react';
import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader';
import { Filler, Spacer, View } from '../View';

export interface Props {
  address: string;
  
  handleReturn: () => void;
}

export const ReceiveView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="Receive funds" />
      <View content={true} className="spread-around">
        <View>Use your public address to fund your wallet.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <label>Public address</label>
      <Message>{props.address}</Message>
      <Spacer />
      <View className="qrCode">
        <QRCode value={props.address} fgColor="#595757" size={100} />
      </View>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleReturn}>Return</Button>
      </View>
    </View>
    
  </View>
);
