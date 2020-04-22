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
import { Filler, IdentityLogoHeader, Spacer, StatusBar, View } from '../../../components';
import { IdentityList } from '../../../components';

export interface Props {
  loading: boolean;
  identities: string[];
  selectedIdentity: string;

  handleAdd: () => void;
  handleBack: () => void;

  handleIdentityClick: (identity: string) => void;
  handleIdentityDelClick: (identity: string) => void;
}

export const IdentitiesView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <IdentityLogoHeader title="Identities" />
      <View content={true} className="spread-around">
        <View>Select the identity to switch to.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around" scroll={true}>
      <View orientation="column" className="scrollView">
        <IdentityList
          identities={props.identities}
          selectedIdentity={props.selectedIdentity}
          onClick={props.handleIdentityClick}
          onDel={props.handleIdentityDelClick}
        />
      </View>
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="add" content="Add" onClick={props.handleAdd} loading={props.loading} disabled={props.loading} />
        <Button content="Back" onClick={props.handleBack} disabled={props.loading} />
      </View>
    </View>
    <StatusBar />
  </View>
);
