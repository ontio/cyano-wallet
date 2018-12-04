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
import { List, Icon } from 'semantic-ui-react';
import { TrustedSc } from 'src/redux/settings';
import { View } from './view';

interface Props {
  onDel: (contract: string) => void;
  trusted: TrustedSc[];
}

export const TrustedList: React.SFC<Props> = (props) => (
  <View>
    <List className="transferList" divided={true}>
      {props.trusted.map((sc, i) => (
        <List.Item key={i}>
          <List.Icon
            name="times circle outline"
            size="large"
            verticalAlign="middle"
            onClick={() => props.onDel(sc.contract)}
          />
          <List.Content>
            <List.Header>{sc.contract}</List.Header>
            <List.Description>
              Confirm: <Icon name={sc.confirm ? 'check' : 'close'} />
              Password: <Icon name={sc.password ? 'check' : 'close'} />
            </List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  </View>
);
