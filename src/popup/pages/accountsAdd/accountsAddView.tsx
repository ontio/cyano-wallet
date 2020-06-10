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
import { AccountLogoHeader, Clickable, Spacer, StatusBar, View } from '../../components';

export interface Props {
  handleCreate: () => void;
  handleImport: () => void;
  handleRestore: () => void;
  handleLedger: () => void;
  handleTrezor: () => void;
  handleBack: () => void;
  handleGoogle: () => void;
  handleDiscord: () => void;
}

export const AccountsAddView: React.SFC<Props> = (props) => (
  <View orientation="column" fluid={true} className="gradient">
    <View orientation="column" className="part gradient">
      <AccountLogoHeader title="Accounts" />
      <View content={true} className="spread-around ">
        <View>Add new account.</View>
      </View>
    </View>
    <View orientation="column" fluid={true} content={true}>
      <View orientation="column" fluid={true} className="center signButtons">
        <Spacer />
        <Button size="small" onClick={props.handleCreate}>
          New account
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleImport}>
          Import private key
        </Button>
        <Spacer />
        <Button size="small" onClick={props.handleRestore}>
          Restore account
        </Button>
        <Spacer />
        <View orientation="row" className="flex-row-between">
                    <Button size="small" onClick={() => props.handleLedger()}>
                    <View orientation="row" className="flex-items-center">
                        <img width="15" height="15" src={require('../../assets/ledger_.svg')} />
                        <span>Ledger</span> 
                    </View>
            </Button>
                    <Button size="small" onClick={() => props.handleTrezor()}>
                    <View orientation="row" className="flex-items-center">
                        <img width="15" height="16" src={require('../../assets/trezor-logo-black.png')} />
                        <span>Trezor</span> 
                    </View>
            </Button>
        </View>
        <Spacer />
        <View orientation="row" className="center">
            or create a new wallet/login using
        </View>
        <Spacer />
        <View orientation="row" className="flex-row-between">
          <Button size="small" onClick={() => props.handleGoogle()}>
              <View orientation="row" className="flex-items-center">
                <img width="15" height="15" src={require('../../assets/google.svg')} />
                <span>Google</span> 
              </View>
          </Button>
          <Button size="small" onClick={() => props.handleDiscord()}>
              <View orientation="row" className="flex-items-center">
                <img width="15" height="15" src={require('../../assets/discord.svg')} />
                <span>Discord</span> </View>
              </Button>
        </View> 
        <Spacer />
        <View orientation="row" className="center">
                <span className="text-light">Powered by &nbsp;</span> 
            <Clickable onClick={() => window.open('https://directauth.io/', '_blank')}>DirectAuth</Clickable>
        </View> 
      </View>
      <View orientation="row" className="center">
        <Button size="small" onClick={props.handleBack}>
          Back
        </Button>      
      </View>
        
      {/* <View className="center ledgerText">
        <Clickable onClick={() => props.handleLedger()}>Ledger</Clickable>
        <View>&nbsp;or&nbsp;</View>
        <Clickable onClick={() => props.handleTrezor()}>Trezor</Clickable>
      </View> */}
    </View>
    <StatusBar />
  </View>
);
