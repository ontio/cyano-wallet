import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import '../global.css';
import { LogoHeader } from '../logoHeader';
import { Filler, View } from '../View';

export interface Props {
  mnemonics: string;
  encryptedPrivateKey: string;
  handleContinue: () => void;
}

export const NewView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="New identity" />
      <View content={true} className="spread-around">
        <View>Here you have your mnemonics phrase and private key. You can use either to restore your identity.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <label>Mnemonics phrase</label>
      <Message>{props.mnemonics}</Message>
      <label>Encrypted private key</label>
      <Message className="breakWords">{props.encryptedPrivateKey}</Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleContinue}>Continue</Button>
      </View>
    </View>
  </View>
);
