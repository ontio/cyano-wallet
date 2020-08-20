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
import { format } from 'date-fns';
import { Claim } from 'ontology-ts-sdk';
import * as React from 'react';
import { List } from 'semantic-ui-react';
import { Filler, IdentityLogoHeader, Spacer, StatusBar, View } from '../../../components';

export interface Props {
  claims: Array<{ tags: string[], claim: Claim }>;
  handleClaimDelClick: (index: number) => void;
  ontId: string;
}

export const IdentityDashboardView: React.SFC<Props> = (props) => {
  return (
    <View orientation="column" fluid={true}>
      <View orientation="column" className="part gradient">
        <IdentityLogoHeader title="My Identity" />
        <View content={true}>
          <View orientation="column">
            <h4>Registered ONT ID</h4>
            <label>{props.ontId}</label>
          </View>
        </View>
      </View>
      <View orientation="column" fluid={true} content={true} className="spread-around">
        <h2>Verifiable Credentials</h2>
        <Spacer />
        <View orientation="column" className="scrollView">
          <List divided={true}>
            {props.claims.map((claim, i) => (
              <List.Item key={i}>
                <List.Icon
                  name="times circle outline"
                  size="large"
                  verticalAlign="middle"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    props.handleClaimDelClick(i);
                  }}
                />
                <List.Content className="breakWords">
                  <List.Header>Tags: {claim.tags.join(' ')}</List.Header>
                  <List.Description>Issuer: {claim.claim.metadata.issuer}</List.Description>
                  <List.Description>MessageId: {claim.claim.metadata.messageId}</List.Description>
                  <List.Description>Issued At: {format(claim.claim.metadata.issuedAt * 1000, 'MMM Do YYYY HH:mm:ss')}</List.Description>
                  {claim.claim.metadata.expireAt && 
                    <List.Description>Expire At: {format(claim.claim.metadata.expireAt * 1000, 'MMM Do YYYY HH:mm:ss')}</List.Description> 
                  }
                </List.Content>
              </List.Item>
            ))}
          </List>
        </View>
        <Spacer />
        <Filler />
      </View>
      <StatusBar />
    </View>
  )
};
