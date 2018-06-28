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
import { Button, Dropdown } from 'semantic-ui-react';
import { Logo, Spacer, View } from '../../components';

export interface LoginOption {
  text: string;
  value: string;
};

export interface Props {
  handleCreate: () => void;
  handleCreateAdvanced: (value: string) => void;
  handleImport: () => void;
  handleImportAdvanced: (value: string) => void;
  handleRestore: () => void;

  loginOptions: LoginOption[];
}

export const SignupView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true} className="gradient">
    <Logo />
    <View orientation="column" className="hint">
      <View>To start using Ontology</View>
      <View>create new account or import existing.</View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" fluid={true} className="center signButtons">
        <Spacer />
        <Button.Group size="small">
          <Button onClick={props.handleCreate}>New account</Button>
          {props.loginOptions.length > 1 ? (
            <Dropdown
            onChange={(e, data) => props.handleCreateAdvanced(data.value as string)}
              options={props.loginOptions}
              value={0}
              text=' '
              button={true}
              className='icon'
            />
          ) : null}
        </Button.Group>
        <Spacer />
        <Button.Group size="small">
          <Button size="small" onClick={props.handleImport}>Import private key</Button>
          {props.loginOptions.length > 1 ? (
            <Dropdown
            onChange={(e, data) => props.handleImportAdvanced(data.value as string)}
              options={props.loginOptions}
              value={0}
              text=' '
              button={true}
              className='icon'
            />
          ) : null}
        </Button.Group>
        <Spacer />
        <Button.Group size="small">
          <Button size="small" onClick={props.handleRestore}>Restore account</Button>
        </Button.Group>
      </View>
    </View>
  </View>
);
