/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import { Filler, LogoHeader, StatusBar, View } from '../../../components';

export interface Props {
  mnemonics: string;
  wif: string;
  handleContinue: () => void;
}

export const IdentityNewView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="New identity" />
      <View content={true} className="spread-around">
        <View>Here is your mnemonics phrase and private key which you can use to restore your identity.</View>
      </View>
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
    <StatusBar />
  </View>
);
