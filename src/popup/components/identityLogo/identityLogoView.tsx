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
import { Button, Icon } from 'semantic-ui-react';
import { View } from '../view';

export interface Props {
  handleSettings: () => void;
  handleAccount: () => void;
}
export const IdentityLogoView: React.SFC<Props> = (props) => (
  <View orientation="column" className="logo"> 
    <View className="spread">
      <View orientation="row" fluid={true} className="buttons">
        <Button size="big" compact={true} basic={true} icon="cog" className="hidden" />
        <Button size="big" compact={true} basic={true} icon="cog" className="hidden" />
      </View>
      <Icon className="img" name="user circle" size="massive" />
      <View orientation="row" fluid={true} className="buttons">
        <Button onClick={props.handleAccount} size="big" compact={true} basic={true} icon="dollar" />
        <Button onClick={props.handleSettings} size="big" compact={true} basic={true} icon="cog" />
      </View>
    </View>
    <h1 className="header">Ontology Identity</h1>
  </View>
);
