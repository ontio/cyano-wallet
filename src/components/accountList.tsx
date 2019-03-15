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
import { View } from './view';

interface Props {
  accounts: string[];
  selectedAccount: string;
  onClick: (account: string) => void;
  onDel: (account: string) => void;
}

export const AccountList: React.SFC<Props> = (props) => (
  <View>
    <List className="accountList" divided={true}>
      {props.accounts.map((account, i) => (
        <List.Item key={i} onClick={(e) => props.onClick(account)}>
          <List.Icon
            name="times circle outline"
            size="large"
            verticalAlign="middle"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              props.onDel(account);
            }}
          />
          <List.Content verticalAlign="middle">
            {account === props.selectedAccount ? <List.Header>{account}</List.Header> : <span>{account}</span>}
          </List.Content>
        </List.Item>
      ))}
    </List>
  </View>
);
