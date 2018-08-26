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
import { Clickable, Logo, Spacer, StatusBar, View } from '../../components';


export interface Props {
  handleCreate: () => void;
  handleImport: () => void;
  handleRestore: () => void;
  handleLedger: () => void;
  handleTrezor: () => void;
}

export const SignupView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true} className="gradient">
    <Logo />
    <View orientation="column" className="hint">
      <View>To start using Ontology</View>
      <View>create a new account or import an existing one.</View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" fluid={true} className="center signButtons">
        <Spacer />
        <Button size="small" onClick={props.handleCreate}>New account</Button>
        <Spacer />
        <Button size="small" onClick={props.handleImport}>Import private key</Button>
        <Spacer />
        <Button size="small" onClick={props.handleRestore}>Restore account</Button>
      </View>
     <View className="center ledgerText">
          <Clickable onClick={() => props.handleLedger()}>Ledger</Clickable>
          <View>&nbsp;or&nbsp;</View>
          <Clickable onClick={() => props.handleTrezor()}>Trezor</Clickable>
     </View> 
    </View>
    <StatusBar />
  </View>
);
