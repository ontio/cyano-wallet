/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of Cyano Wallet.
 *
 * Cyano Wallet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cyano Wallet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cyano Wallet.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from 'react';
import { List } from 'semantic-ui-react';
import { View } from './view';

interface Props {
  identities: string[];
  selectedIdentity: string;
  onClick: (identity: string) => void;
  onDel: (identity: string) => void;
}

export const IdentityList: React.SFC<Props> = (props) => (
  <View>
    <List className="identityList" divided={true} size="small">
      {props.identities.map((identity, i) => (
        <List.Item key={i} onClick={(e) => props.onClick(identity)}>
          <List.Icon
            name="times circle outline"
            size="large"
            verticalAlign="middle"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              props.onDel(identity);
            }}
          />
          <List.Content verticalAlign="middle" className="wrap small">
            {identity === props.selectedIdentity ? <List.Header>{identity}</List.Header> : <span>{identity}</span>}
          </List.Content>
        </List.Item>
      ))}
    </List>
  </View>
);
