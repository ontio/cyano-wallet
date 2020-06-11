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
import { Button, Message } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';

export interface Props {
  loading: boolean;
  account: string;
  isDiscordAccount: boolean;
  handleConfirm: () => Promise<void>;
  handleCancel: () => void;
}

export const AccountsDelView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Account remove" />
      <View content={true} className="spread-around">
        <View>Confirm account removal. Be sure to have a backup.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <label>Account</label>
      <Message>{props.account}</Message>
      <Spacer />
      {props.isDiscordAccount &&
        <View>Please note! Due to certain security concerns, you will not be able to login to the wallet linked to this Discord account for the next 30 minutes. Are you sure you want to remove this wallet? </View>
      }
      <Filler />
      <View className="buttons">
        <Button
          icon="check"
          disabled={props.loading}
          loading={props.loading}
          onClick={props.handleConfirm}
          content="Confirm"
        />
        <Button disabled={props.loading} onClick={props.handleCancel}>
          Cancel
        </Button>
      </View>
    </View>
    <StatusBar />
  </View>
);
