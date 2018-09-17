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
import { AccountLogoHeader, Filler, StatusBar, View } from '../../components';


export interface Props {
  message: string;
  locked: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const MessageSignView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Message sign" />
      <View content={true} className="spread-around">
        <View>Read carefully what you sign.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <label>Message</label>
      <Message className="scroll">{props.message}</Message>
      <Filler />
      <View className="buttons">
        <Button onClick={props.handleConfirm}>Continue</Button>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </View>
    </View>
    <StatusBar />
  </View>
);
