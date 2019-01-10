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
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { encodeWallet, getWallet } from 'src/api/authApi';
import { reduxConnect, withProps } from '../../../compose';
import { Actions, GlobalState } from '../../../redux';
import { IdentitiesView, Props } from './identitiesView';

const mapStateToProps = (state: GlobalState) => ({
  transfers: state.runtime.transfers,
  wallet: state.wallet.wallet,
  loading: state.loader.loading,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      finishLoading: Actions.loader.finishLoading,
      setWallet: Actions.wallet.setWallet,
      startLoading: Actions.loader.startLoading,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const wallet = getWallet(reduxProps.wallet!);
    const identities = wallet.identities.map((identity) => identity.ontid);

    return withProps(
      {
        identities,
        handleIdentityClick: async (identity: string) => {
          wallet.setDefaultIdentity(identity);
          const encodedWallet = encodeWallet(wallet);

          await actions.startLoading();
          await actions.setWallet(encodedWallet);

          await actions.finishLoading();

          props.history.push('/identity');
        },
        handleIdentityDelClick: (identity: string) => {
          props.history.push('/identity/del', { identity });
        },
        handleAdd: () => {
          props.history.push('/identity/add');
        },
        handleBack: () => {
          props.history.push('/identity');
        },
        selectedIdentity: wallet.defaultOntid,
        loading: reduxProps.loading,
      },
      (injectedProps) => <Component {...injectedProps} />,
    );
  });

export const Identities = enhancer(IdentitiesView);
