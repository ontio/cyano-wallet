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
import { format } from 'date-fns';
import * as React from 'react';
import { List } from 'semantic-ui-react';
import { Transfer } from '../../redux/runtime';
import { View } from './view';

interface Props {
  transfers: Transfer[];
  ownAddress: string;
}

export const TransferList: React.SFC<Props> = (props) => (
  <View>
    <List className="transferList" divided={true}>
      {props.transfers.map((transfer, i) => (
        <List.Item key={i}>
          <List.Icon name={transfer.from === props.ownAddress ? 'arrow alternate circle down outline' : 'arrow alternate circle up outline'} size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header>{transfer.from === props.ownAddress ? '-' : ''}{transfer.amount} {transfer.asset}</List.Header>
            <List.Description>{transfer.from === props.ownAddress ? transfer.to : transfer.from}</List.Description>
            <List.Description>{format(transfer.time * 1000, 'MMM Do YYYY HH:mm:ss')}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </View>
);
