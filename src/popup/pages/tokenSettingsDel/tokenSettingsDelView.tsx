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
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';

export interface Props {
  loading: boolean;
  contract: string;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

export const TokenSettingsDelView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="OEP-4 token remove" />
      <View content={true} className="spread-around">
        <View>Confirm token removal.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <label>OEP-4 token</label>
      <Message>{props.contract}</Message>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="check" disabled={props.loading} loading={props.loading} onClick={props.handleConfirm} content="Confirm"/>
        <Button disabled={props.loading} onClick={props.handleCancel}>Cancel</Button>
      </View>
    </View>
    <StatusBar />
  </View>
);
