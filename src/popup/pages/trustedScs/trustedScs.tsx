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
import { dummy, reduxConnect, withProps } from '../../compose';
import { GlobalState } from '../../redux';
import { Props, TrustedScsView } from './trustedScsView';

const mapStateToProps = (state: GlobalState) => ({
  trustedScs: state.settings.trustedScs,
});

const enhancer = (Component: React.ComponentType<Props>) => (props: RouterProps) =>
  reduxConnect(mapStateToProps, dummy, (reduxProps) =>
    withProps(
      {
        handleAdd: () => {
          props.history.push('/settings/trusted/add');
        },
        handleBack: () => {
          props.history.replace('/settings');
        },
        handleDel: (contract: string) => {
          props.history.push('/settings/trusted/del', { contract });
        },
      },
      (injectedProps) => <Component {...injectedProps} trusted={reduxProps.trustedScs} />,
    ),
  );

export const TrustedScs = enhancer(TrustedScsView);
