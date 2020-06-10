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
  baseUrl: TorusOptions.baseUrl,
  redirectToOpener: true,
})
torus.init({skipSw: true})

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
            const obj = await torus.triggerAggregateLogin({aggregateVerifierType: "single_id_verifier", subVerifierDetailsArray: [{
              clientId: TorusOptions.GOOGLE_CLIENT_ID,
              typeOfLogin: "google",
              verifier: "google-web",
            }], verifierIdentifier: "google-ontology", })
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
            const obj = await torus.triggerLogin({typeOfLogin: "discord", verifier: "discord-ontology", clientId: TorusOptions.DISCORD_CLIENT_ID});
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
