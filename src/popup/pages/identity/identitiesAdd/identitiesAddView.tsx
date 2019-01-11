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
import { IdentityLogoHeader, Spacer, StatusBar, View } from '../../../components';

export interface Props {
  handleCreate: () => void;
  handleImport: () => void;
  handleRestore: () => void;
  handleBack: () => void;
}

export const IdentitiesAddView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <IdentityLogoHeader title="Identities" />
      <View content={true} className="spread-around ">
        <View>Add new identity.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" fluid={true} className="center signButtons">
        <Spacer />
        <Button size="small" onClick={props.handleCreate}>
          New identity
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleImport}>
          Import private key
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleRestore}>
          Restore identity
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleBack}>
          Back
        </Button>
      </View>
    </View>
    <StatusBar />
  </View>
);
