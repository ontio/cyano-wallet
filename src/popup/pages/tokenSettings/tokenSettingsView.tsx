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
import { Button } from 'semantic-ui-react';
import { TokenState } from 'src/redux/settings';
import { Filler, LogoHeader, Spacer, StatusBar, TokenList, View } from '../../components';

export interface Props {
  tokens: TokenState[];
  handleAdd: () => void;
  handleDel: (contract: string) => void;
  handleBack: () => void;
}

export const TokenSettingsView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <LogoHeader title="OEP-4 Tokens" />
      <View content={true} className="spread-around">
        <View>Manage OEP-4 tokens.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around" scroll={true}>
      <View orientation="column" className="scrollView">
        <TokenList tokens={props.tokens} onDel={props.handleDel} />
      </View>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="add" content="Add" onClick={props.handleAdd} />
        <Button content="Back" onClick={props.handleBack} />
      </View>
    </View>
    <StatusBar />
  </View>
);
