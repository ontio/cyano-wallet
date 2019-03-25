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
import { View } from '../view';

export interface Props {
  title: string;
  handleClear: () => void;
  handleSettings: () => void;
  handleAccounts: () => void;
  showLogout: boolean;
  showSettings: boolean;
  showAccounts: boolean;
}

export const LogoHeaderView: React.SFC<Props> = (props) => (
  <View className="logoHeader space-betweem">
    <View>
      <img height="30" src={require('../../assets/logo-main.png')} />
      <span>Onyx Wallet</span>
    </View>
    <View>
      <h1>{props.title}</h1>
    </View>
    <View orientation="row" className="buttons">
      { props.showAccounts ? <Button onClick={props.handleAccounts} size="big" compact={true} basic={true} icon="exchange" /> : (null) }
      { props.showSettings ? <Button onClick={props.handleSettings} size="big" compact={true} basic={true} icon="cog" /> : (null) }
      { props.showLogout ? <Button onClick={props.handleClear} size="big" compact={true} basic={true} icon="shutdown" /> : (null) }
    </View>
  </View>
);
