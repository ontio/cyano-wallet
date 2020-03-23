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
import { List } from 'semantic-ui-react';
import { OEP4TokenAmount } from 'src/api/tokenApi';
import { View } from './view';

interface Props {
  tokens: OEP4TokenAmount[];
}

export const TokenAmountList: React.SFC<Props> = (props) => (
  <View>
    <List className="transferList" divided={true}>
      {props.tokens.map((token, i) => (
        <List.Item key={i}>
          <List.Content floated='right'>
            <List.Description className="asset-amount">
              {token.amount}
            </List.Description>
          </List.Content>
            <List.Icon name="gem outline" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>{token.symbol}</List.Header>
            <List.Description>{token.name}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </View>
);
