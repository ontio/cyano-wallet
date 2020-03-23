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
import { List } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { OEP4TokenAmount } from 'src/api/tokenApi';
import { AccountLogoHeader, Filler, Spacer, StatusBar, TokenAmountList, View } from '../../components';

export interface Props {
  nepAmount: string;
  ontAmount: string;
  ongAmount: string;

  unboundAmount: string;
  ownAddress: string;
  tokens: OEP4TokenAmount[];
  handleSend: () => void;
  handleTransfers: () => void;
  handleReceive: () => void;
  handleWithdraw: () => void;
  handleSwap: () => void;
}

export const DashboardView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true}>
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Balances" />
      <View content={true} className="spread-around balance-wrapper">
        <View orientation="column" className="balance">
          <label>ONT</label>
          <h1>{props.ontAmount}</h1>
          {/* <h3>{props.ontAmount}</h3>
          <h4 onClick={props.handleSwap} className="unbound"> {props.nepAmount} (Swap)</h4> */}
        </View>
        <View orientation="column" className="balance">
          <label>ONG</label>
          <h3>{props.ongAmount}</h3>
          <h4 onClick={props.handleWithdraw} className="unbound"> {props.unboundAmount} (Claim)</h4>
        </View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true} className="spread-around">
      <h1>OEP-4 tokens</h1>
      <Spacer />
      <TokenAmountList tokens={props.tokens} />
      <Spacer />
      <Filler />
      <View className="buttons">
        <Button icon="send" content="Send" onClick={props.handleSend} />
        <Button icon="inbox" content="Receive" onClick={props.handleReceive} />
        <Button icon="list" onClick={props.handleTransfers} />
      </View>
    </View>
    <StatusBar />
  </View>
);
