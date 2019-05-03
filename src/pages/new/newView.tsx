import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import { Filler, LogoHeader, View } from '../../components';

export interface Props {
  mnemonics: string;
  wif: string;
  handleContinue: () => void;
}

export const NewView: React.SFC<Props> = props => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader showLogout={false} showAccounts={false} title="New account" />
      <View content={true} className="spread-around">
        <View>
          Here you have your mnemonics phrase and private key. You can use either to restore your
          account.
          <br />
          Make sure you write them down and keep them safe. The mnemonics phrase and private key
          cannot be restored.
        </View>
      </View>
    </View>
    <View className="red-text-on-create-new">
      <p>
        <strong>NOTE</strong>: To protect your privacy, Onyx Wallet does not store private keys
        externally. Private keys are stored <strong>only</strong> in your browser and encrypted with
        your password. Clearing local storage may result in <strong>permanent loss</strong> of
        private keys. Make sure to{" "}
        <strong>always backup your private key and mnemonics phrase</strong>.
      </p>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <label>Mnemonics phrase</label>
      <Message className="scroll">{props.mnemonics}</Message>
      <label>Private key (WIF format)</label>
      <Message className="breakWords">{props.wif}</Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleContinue}>Continue</Button>
      </View>
    </View>
  </View>
);
