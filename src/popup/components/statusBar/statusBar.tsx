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
import { GlobalState } from '../../../redux/state';
import { dummy, reduxConnect, withProps } from '../../compose';
import { Props, StatusBarView } from './statusBarView';

const mapStateToProps = (state: GlobalState) => ({
  net: state.settings.net,
  status: state.status.networkState
});

const enhancer = (Component: React.ComponentType<Props>) => () => (
  reduxConnect(mapStateToProps, dummy, (reduxProps) => {
    const net = reduxProps.net;

    let netName = '';
    if (net === 'MAIN') {
      netName = 'MAIN-NET';
    } else if (net === 'TEST') {
      netName = 'TEST-NET';
    } else {
      netName = 'PRIVATE-NET';
    }

    return (
      withProps({

      }, (props) => (
        <Component status={reduxProps.status} netName={netName} />
      ))
    );
  })
);

export const StatusBar = enhancer(StatusBarView);
