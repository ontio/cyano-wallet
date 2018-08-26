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
import * as QRCode from 'qrcode.react';
import * as React from 'react';
import { Button, Message } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';

export interface Props {
  address: string;
  
  handleReturn: () => void;
}

export const ReceiveView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Receive funds" />
      <View content={true} className="spread-around">
        <View>Use your public address to send funds to your wallet.</View>
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
    <StatusBar />
  </View>
);
