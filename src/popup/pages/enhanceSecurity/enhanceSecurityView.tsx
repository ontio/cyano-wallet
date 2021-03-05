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
import { Button, Icon, List } from 'semantic-ui-react';
import { AccountLogoHeader, Filler, Spacer, StatusBar, View } from '../../components';

export interface Props {
  loading: boolean;
  handleBack: () => void;
  handleEnhanceSecurity: (account: string) => void;
  selectedAccount: string;
  unsafeAccounts: string[];
}

export const EnhanceSecurityView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Enhance Security" />
      <View content={true} className="spread-around">
        <View>
          <div>
            List of accounts that need to enhance security.
          </div>
        </View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" className="scrollView">
        <List divided={true}>
          {props.unsafeAccounts.map((account, i) => (
            <List.Item key={i}>
              <View className="items-center">
                <List.Content>
                  {account}
                </List.Content>
                <Filler />
                <List.Content>
                  <Button
                    size="mini"
                    icon={true}
                    onClick={() => props.handleEnhanceSecurity(account)}
                    loading={props.loading && account === props.selectedAccount}
                    disabled={props.loading}
                  >
                    <Icon name="angle double up" />
                  </Button>
                </List.Content>
              </View>
            </List.Item>
          ))}
        </List>
      </View>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button content="Back" onClick={props.handleBack} />
      </View>
    </View>
    <StatusBar />
  </View>
);
