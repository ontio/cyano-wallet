
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
import { SimpleMessage } from 'ontology-ts-sdk';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { encodeWallet, getWallet } from '../../../../api/authApi';
import { getCredentialRecords } from '../../../../api/extraApi';
import { getIdentity } from '../../../../api/identityApi';
import { reduxConnect, withProps } from '../../../compose';
import { Actions, GlobalState } from '../../../redux';
import { IdentityDashboardView, Props } from './identityDashboardView';

const mapStateToProps = (state: GlobalState) => ({
  walletEncoded: state.wallet.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setWallet: Actions.wallet.setWallet,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const wallet = getWallet(reduxProps.walletEncoded!);
    const ontId = getIdentity(wallet)!;
    const credentialRecords = getCredentialRecords(wallet);

    const filteredCredentialRecords = credentialRecords
    .filter((item: any) => item.identity === ontId);

    const mappedCredentialRecords = filteredCredentialRecords
    .map((item: any) => ({ tags: item.tags, credential: SimpleMessage.deserialize(item.credential) }));

    return withProps({
      credentialRecords: mappedCredentialRecords,
      handleDelClick: (index: number) => {
        const credentialRecord = filteredCredentialRecords[index];
        const indexInOrigin = credentialRecords.indexOf(credentialRecord);
        const newCredentialRecords = credentialRecords.slice();
        newCredentialRecords.splice(indexInOrigin, 1);
        wallet.extra = { ...(wallet.extra || {}), credentialRecords: newCredentialRecords };
        actions.setWallet(encodeWallet(wallet));
      },
      ontId,
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ));
  })
);

export const IdentityDashboard = enhancer(IdentityDashboardView);
