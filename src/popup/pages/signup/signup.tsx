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
import DirectWebSDK from '@toruslabs/torus-direct-web-sdk'
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { accountImportPrivateKey } from 'src/api/accountApi';
import { getBackgroundManager } from 'src/popup/backgroundManager';
import {TorusOptions} from '../../../api/constants'
import { reduxConnect, withProps } from '../../compose';
import { Actions, GlobalState } from '../../redux';
import { Props, SignupView } from './signupView';

const torus = new DirectWebSDK({
  DISCORD_CLIENT_ID: TorusOptions.DISCORD_CLIENT_ID,
  FACEBOOK_CLIENT_ID: '2554219104599979',
  GOOGLE_CLIENT_ID: TorusOptions.GOOGLE_CLIENT_ID,
  REDDIT_CLIENT_ID: 'dcQJYPaG481XyQ',
  TWITCH_CLIENT_ID: 'tfppratfiloo53g1x133ofa4rc29px',
  baseUrl: TorusOptions.baseUrl,
  network: 'ropsten',
  proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
  redirectToOpener: true,
})
torus.init()

const mapStateToProps = (state: GlobalState) => ({
    loading: state.loader.loading,
    wallet: state.wallet.wallet
  });
  
  const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ 
    finishLoading: Actions.loader.finishLoading,
    setWallet: Actions.wallet.setWallet,
    startLoading: Actions.loader.startLoading
  }, dispatch);
  
  const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
    reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => (
      withProps({
        handleCreate: () => {
          props.history.push('/create');
        },
        handleImport: () => {
          props.history.push('/import');
        },
        handleLedger: () => {
          props.history.push('/ledger/signup');
        },
        handleRestore: () => {
          props.history.push('/restore');
        },
        handleTrezor: () => {
          props.history.push('/trezor/signup');
        },
        // tslint:disable-next-line:object-literal-sort-keys
        handleGoogle: async () => {
          try {
            const obj = await torus.triggerLogin('google', 'google-ontology');
            const { wallet } = accountImportPrivateKey(obj.privateKey.toString(), '', reduxProps.wallet, 'google');
            await actions.setWallet(wallet);
            await getBackgroundManager().refreshBalance();
            props.history.push('/dashboard');
          } catch (e) {
            // tslint:disable-next-line:no-console
            console.warn("could not retrieve key from DirectAuth: ", e)
          }
        },
        handleDiscord: async () => {
          try {
            const obj = await torus.triggerLogin('discord', 'discord-ontology');
            const { wallet } = accountImportPrivateKey(obj.privateKey.toString(), '', reduxProps.wallet, 'discord');
            await actions.setWallet(wallet);
            
            await getBackgroundManager().refreshBalance();
            props.history.push('/dashboard');
          } catch (e) {
            // tslint:disable-next-line:no-console
            console.warn("could not retrieve key from DirectAuth: ", e)
          }
        }
      }, (injectedProps) => (
        <Component {...injectedProps} />
      ))
    ))
  )


export const Signup = enhancer(SignupView);
