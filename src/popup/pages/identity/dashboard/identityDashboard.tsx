
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
import { Claim } from 'ontology-ts-sdk';
import * as React from 'react';
import { RouterProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { getIdentity } from '../../../../api/identityApi';
import { reduxConnect, withProps } from '../../../compose';
import { Actions, GlobalState } from '../../../redux';
import { IdentityDashboardView, Props } from './identityDashboardView';

const mapStateToProps = (state: GlobalState) => ({
  claims: state.claims,
  walletEncoded: state.wallet.wallet,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setClaims: Actions.claim.setClaims,
    },
    dispatch,
  );

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) => (
  reduxConnect(mapStateToProps, mapDispatchToProps, (reduxProps, actions) => {
    const ontId = getIdentity(reduxProps.walletEncoded!)!;
    const claims = reduxProps.claims.filter(claim => claim.ontid === ontId);
    const parsedClaims = claims.map(claim => ({ tags: claim.tags, claim: Claim.deserialize(claim.body) }));

    return withProps({
      claims: parsedClaims,
      handleClaimDelClick: (index: number) => {
        const newClaims = reduxProps.claims.slice();
        newClaims.splice(index, 1);
        actions.setClaims(newClaims);
      },
      ontId,
    }, (injectedProps) => (
      <Component {...injectedProps} />
    ));
  })
);

export const IdentityDashboard = enhancer(IdentityDashboardView);
