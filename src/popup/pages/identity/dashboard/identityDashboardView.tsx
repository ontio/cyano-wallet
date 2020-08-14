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
import { Filler, IdentityLogoHeader, Spacer, StatusBar, View } from '../../../components';
import { Claim } from '@ont-dev/ontology-dapi';
import { Claim as OntClaim } from 'ontology-ts-sdk';
import { List } from 'semantic-ui-react';
import { format } from 'date-fns';

export interface Props {
  ontId: string;
  claims: Claim[];
}

export const IdentityDashboardView: React.SFC<Props> = (props) => {
  const claims = props.claims.filter(claim => claim.ontid === props.ontId);
  const parsedClaims = claims.map(claim => ({ tags: claim.tags, claim: OntClaim.deserialize(claim.body) }));
  console.log(parsedClaims);

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
        <h1>Verifiable Credentials</h1>
        <Spacer />
        <List divided={true}>
          {parsedClaims.map((claim, i) => (
            <List.Item key={i}>
              <List.Content>
                <List.Header>Tags: {claim.tags.join(' ')}</List.Header>
                <List.Description>Context: {claim.claim.context}</List.Description>
                <List.Description>Issuer: {claim.claim.metadata.issuer}</List.Description>
                {
                  claim.claim.content.IssuerName &&
                  <List.Description>Issuer Name: {claim.claim.content.IssuerName}</List.Description>
                }
                <List.Description>Issuer At: {format(claim.claim.metadata.issuedAt * 1000, 'MMM Do YYYY HH:mm:ss')}</List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
        <Spacer />
        <Filler />
      </View>
      <StatusBar />
    </View>
  )
};
