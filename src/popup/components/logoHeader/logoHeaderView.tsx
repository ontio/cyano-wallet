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
import { Button } from 'semantic-ui-react';
import { View } from '../view';

export interface Props {
  title: string;

  handleSettings: () => void;
  handleIdentity: () => void;
  handleAccount: () => void;
  handleChange: () => void;

  showSettings: boolean;
  showIdentity: boolean;
  showAccount: boolean;
  showChange: boolean;
}

export const LogoHeaderView: React.SFC<Props> = (props) => (
  <View className="logoHeader">
    <img height="30" src={require('../../assets/gem2.svg')} />
    <h1>{props.title}</h1>
    <View orientation="row" fluid={true} className="buttons">
      {props.showChange ? (
        <Button
          onClick={props.handleChange}
          size="big"
          compact={true}
          basic={true}
          icon="exchange"
          title={`${props.showIdentity ? 'Account' : 'Identity'} switch`} />
      ) : null}
      {props.showIdentity ? (
        <Button
          onClick={props.handleIdentity}
          size="big"
          compact={true}
          basic={true}
          icon="id card outline"
          title="Go to Identity" />
      ) : null}
      {props.showAccount ? (
        <Button
          onClick={props.handleAccount}
          size="big"
          compact={true}
          basic={true}
          icon="dollar"
          title="Go to Account" />
      ) : null}
      {props.showSettings ? (
        <Button
          onClick={props.handleSettings}
          size="big"
          compact={true}
          basic={true}
          icon="cog"
          title="Settings" />
      ) : null}
    </View>
  </View>
);
